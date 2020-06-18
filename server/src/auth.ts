/* eslint-disable camelcase */

import Axios from 'axios';
import { Dropbox } from 'dropbox';
import 'isomorphic-fetch';
import * as querystring from 'querystring';
import { createLogger, format, transports } from 'winston';
// eslint-disable-next-line no-unused-vars
import express from 'express';

const logFormat = format.combine(format.colorize(), format.prettyPrint());
const errorLogger = createLogger({
  level: 'error',
  format: logFormat,
  transports: [new transports.Console()]
});

// interface for access token
interface IAccessToken {
  access_token: string;
  uid: number;
  account_id: string;
  bearer: string;
  token_type: string;
}

export async function Authorize (req: express.Request, resp: express.Response) {
  try {
    // prepare the request body and config for google oauth
    const queryString = querystring.stringify({
      // dropbox client id
      client_id: process.env.CLIENT_ID as string,
      // dropbox callback url
      redirect_uri: process.env.OAUTH_CALLBACK as string,
      response_type: 'code'
    });
    // redirect use for oAuth authorization with Dropbox
    resp.redirect(
      `${process.env.OAUTH_AUTHORIZE_URL as string}/?${queryString}`
    );
  } catch (error) {
    errorLogger.log({
      level: 'error',
      message: error
    });
  }
}

export async function isUserLoggedIn (req: express.Request, resp: express.Response) {
  try {
    if (req.session && req.session.logged_in) {
      return resp.json({
        loggedin: true
      });
    } else {
      return resp.json({
        loggedin: false
      });
    }
  } catch (error) {
    errorLogger.log({
      level: 'error',
      message: error
    });
    return resp.json({
      loggedin: false,
      message: 'Failed to validate.'
    });
  }
}

export async function RevokeToken (req: express.Request, res: express.Response) {
  try {
    if (req.session && req.session.access_token) {
      await new Dropbox({
        accessToken: req.session.access_token,
        clientId: process.env.CLIENT_ID as string
      }).authTokenRevoke(undefined);
    }
    res.send('Revoked');
  } catch (error) {
    errorLogger.log({
      level: 'error',
      message: error
    });
  }
}

// this function retrieves the access token for making api calls
export async function Authenticate (req: express.Request, resp: express.Response) {
  // prepare the request body
  const requestBody = {
    // dropbox client id
    client_id: process.env.CLIENT_ID,
    // dropbox client secret
    client_secret: process.env.CLIENT_SECRET,
    // code received from Authorize call
    code: req.query.code,
    // default oAuth grant type
    grant_type: 'authorization_code',
    // dropbox oauth callback
    redirect_uri: process.env.OAUTH_CALLBACK
  };
  console.log(requestBody);
  // setup axios config
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  try {
    // fetch the access token
    console.log('fetching token');
    const oAuthTokenResponse = await Axios.post(
      process.env.OAUTH_TOKEN_URL as string,
      querystring.stringify(requestBody),
      config
    );
    console.log('received token');

    const oAuthResponse: IAccessToken = oAuthTokenResponse.data as IAccessToken;
    // check if the session is established and store the access token
    if (req.session) {
      console.log('creating session');

      req.session.access_token = oAuthResponse.access_token;
      req.session.account_id = oAuthResponse.account_id;
      req.session.logged_in = true;
      req.session.save((err: any) => {
        console.log('saved session');
        if (err) {
          throw new Error('Failed to save session');
        }
        resp.redirect(process.env.DASHBOARD as string);
      });
    }
    // redirect to home
  } catch (error) {
    console.log(error);
    errorLogger.log({
      level: 'error',
      message: error.response.status
    });
  }
}
