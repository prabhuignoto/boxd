/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import { Request, Response } from 'express';
import FS from 'graceful-fs';
import Path from 'path';
import util from 'util';
import { ErrorLogger, InfoLogger } from './logger';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';

const fileExists = util.promisify(FS.exists);
const writeFileAsync = util.promisify(FS.writeFile);

export default async function Download (req: FastifyRequest, resp: FastifyReply<ServerResponse>) {
  try {
    type DownloadMetadata = files.FileMetadata & { fileBinary: Buffer };

    InfoLogger.log({
      level: 'info',
      message: `Downloading ${req.query.path}`
    });

    if (req.session && req.session.access_token) {
      const metadata: DownloadMetadata = (await new Dropbox({
        accessToken: req.session.access_token,
        clientId: process.env.CLIENT_ID
      }).filesDownload({
        path: req.query.path
      })) as DownloadMetadata;

      const dirName = req.session.account_id.replace(/dbid:/, '');
      const appRoot = require.main && Path.join(
        // Path.parse(process.mainModule!.filename).dir,
        Path.parse(require.main.filename).dir,
        '../'
      );

      if (appRoot) {
        const dirPath = Path.resolve(appRoot, 'downloads/' + dirName);
        const filePath = Path.resolve(dirPath, metadata.name);

        InfoLogger.log({
          level: 'info',
          message: `Generating file path ${filePath}`
        });

        const createFile = async () => {
          const result = await fileExists(filePath);

          if (!result) {
            await writeFileAsync(filePath, metadata.fileBinary);
            InfoLogger.log({
              level: 'info',
              message: `${
                metadata.name
                } successfully created on ${filePath}`
            });
          }
          const stream = FS.createReadStream(Path.resolve(filePath));
          resp.send(stream);
          // resp.download(filePath, metadata.name);
        };

        await FS.exists(dirPath, (exists) => {
          if (!exists) {
            FS.mkdir(dirPath, () => {
              createFile();
            });
          } else {
            createFile();
          }
        });
      }
    }
    return {};
  } catch (error) {
    ErrorLogger.log({
      level: 'error',
      message: error.response.statusText
    });
    return {};
  }
}
