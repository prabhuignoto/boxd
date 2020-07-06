import { Buffer } from 'buffer';
import { Dropbox } from 'dropbox';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import FS from 'graceful-fs';
import nodeFetch from 'node-fetch';
import util from 'util';
import { ErrorLogger, InfoLogger } from './logger';
import Pusher from './pusher';

const unlinkAsync = util.promisify(FS.unlink);

// tslint: disable-next-line
export default async function Upload (req: Request, resp: Response) {
  try {
    const files: any = req.files;

    InfoLogger.log({
      message: `Uploading ${files[0].originalname} to ${req.body.uploadPath}`,
      level: 'info'
    });

    const readStream = await FS.createReadStream(files[0].path);

    const chunks: any = [];

    readStream.on('error', () => {
      throw new Error('Failed to read the file');
    });

    readStream.on('data', chunk => {
      chunks.push(chunk);
    });

    readStream.on('close', async () => {
      const contents = Buffer.concat(chunks);

      const response = await new Dropbox({
        accessToken: req.session!.access_token,
        clientId: process.env.CLIENT_ID,
        fetch: nodeFetch
      }).filesUpload({
        contents,
        autorename: true,
        path: `${req.body.uploadPath}/${files[0].originalname}`
      });

      await unlinkAsync(files[0].path);

      if (response) {
        resp.json({
          success: true,
          status: 'completed',
          status_text: 'File uploaded successfully.'
        });
        Pusher && Pusher.trigger('channel-upload', 'uploadCompleted', {
          fileUploaded: {
            success: true,
            fileName: files[0].originalname as string,
            uiJobId: req.body.uiJobId,
            path: req.body.uploadPath
          }
        });
      }
    });
    return Promise.resolve(true);
  } catch (error) {
    ErrorLogger.log({
      level: 'error',
      message: error.response.statusText
    });
    Pusher && Pusher.trigger('channel-upload', 'uploadCompleted', {
      fileUploaded: {
        success: false,
        uiJobId: req.body.uiJobId
      }
    });
    return Promise.resolve(false);
  }
}
