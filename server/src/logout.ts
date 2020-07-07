/* eslint-disable no-unused-vars */
import { Dropbox } from 'dropbox';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import { ErrorLogger, InfoLogger } from "./logger";

export default async function Logout (req: FastifyRequest, resp: FastifyReply<ServerResponse>) {
  try {
    InfoLogger.log({
      level: 'info',
      message: `Uploading ${req.query.path}`
    });
    await new Dropbox({
      accessToken: req.session!.access_token,
      clientId: process.env.CLIENT_ID
    }).authTokenRevoke(undefined);

    if (req.session) {
      req.sessionStore.destroy(req.session.sessionId, () => {});
      req.session.destroy(() => {
        InfoLogger.log({
          level: 'info',
          message: 'Session destroyed'
        });
      });
    }

    return resp.send({
      message: 'Successfully logged out',
      success: true
    });
  } catch (error) {
    ErrorLogger.log({
      level: 'error',
      message: error.response.statusText
    });
    return resp.send({
      message: 'Failed to log out',
      success: false
    });
  }
}
