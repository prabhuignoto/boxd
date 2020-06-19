import { Buffer } from 'buffer';
import { Dropbox } from 'dropbox';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import FS from 'graceful-fs';
import nodeFetch from 'node-fetch';
import { createLogger, format, transports } from 'winston';
import pubsub from './pubSub';

const logFormat = format.combine(format.timestamp(), format.prettyPrint());
const errorLogger = createLogger({
  level: 'error',
  format: logFormat,
  transports: [new transports.Console()]
});
const infoLogger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [new transports.Console()]
});

// tslint: disable-next-line
export default function Upload(req: Request, resp: Response) {
  try {
    const files: any = req.files;
    infoLogger.log({
      message: `Uploading ${files[0].originalname} to ${req.body.uploadPath}`,
      level: 'info'
    });

    const readStream = FS.createReadStream(files[0].path);
    const chunks: any = [];
    readStream.on('error', () => {
      throw new Error('Failed to read the file');
    });

    readStream.on('data', chunk => {
      chunks.push(chunk);
    });

    readStream.on('close', () => {
      const response = new Dropbox({
        accessToken: req.session!.access_token,
        clientId: process.env.CLIENT_ID,
        fetch: nodeFetch
      }).filesUpload({
        contents: Buffer.concat(chunks),
        autorename: true,
        path: `${req.body.uploadPath}/${files[0].originalname}`
      });

      FS.unlink(files[0].path, function (err) {
        if (err) {
          throw new Error('Failed to complete the cleanup.');
        }
        response
          .then(data => {
            resp.json({
              success: true,
              status: 'completed',
              status_text: 'File uploaded successfully.'
            });
            pubsub.publish('upload_completed', {
              fileUploaded: {
                success: true,
                fileName: files[0].originalname as string
              }
            });
          })
          .catch(() => {
            resp.json({
              success: false,
              status: 'failed',
              status_text: 'Upload failed.'
            });
            pubsub.publish('upload_completed', {
              fileUploaded: {
                success: false,
                message: 'Failed to upload the file'
              }
            });
          });
      });
    });
    return true;
  } catch (error) {
    errorLogger.log({
      level: 'error',
      message: error.response.statusText
    });
    return resp.json({
      success: false,
      status: 'failed',
      status_text: 'Upload failed'
    });
  }
}
