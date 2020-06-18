import { Dropbox, files } from 'dropbox';
import FS from 'fs';
import Path from 'path';
import { createLogger, format, transports } from 'winston';
import { ErrorLogger } from '../logger';

const logFormat = format.combine(format.timestamp(), format.prettyPrint());
const infoLogger = createLogger({
  format: logFormat,
  level: 'info',
  transports: [new transports.Console()]
});

export default {
  Query: {
    downloadFile: async (obj: any, args: any, context: any, info: any) => {
      try {
        type DownloadMetadata = files.FileMetadata & { fileBinary: Buffer };

        infoLogger.log({
          level: 'info',
          message: `Downloading ${args.path}`
        });

        const metadata: DownloadMetadata = (await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesDownload({
          path: args.path
        })) as DownloadMetadata;

        infoLogger.log({
          level: 'error',
          message: `Downloaded file ${metadata.name}`
        });

        const dirName = context.session.account_id.replace(/dbid:/, '');
        const appRoot = require.main && Path.join(
          Path.parse(require.main.filename).dir,
          '../'
        );

        if (appRoot) {
          const dirPath = Path.resolve(appRoot, 'downloads/' + dirName);
          const filePath = Path.resolve(dirPath, metadata.name);
          infoLogger.log({
            level: 'info',
            message: `Generating file path ${filePath}`
          });

          const createFile = async () => {
            await FS.access(filePath, (exists) => {
              if (!exists) {
                FS.writeFile(filePath, metadata.fileBinary, (err: any) => {
                  if (err) {
                    throw new Error('Failed to create the file');
                  } else {
                    infoLogger.log({
                      message: `${metadata.name} successfully created on ${filePath}`,
                      level: 'info'
                    });
                  }
                });
              }
            });
          };

          await FS.access(dirPath, async (exists) => {
            if (!exists) {
              await FS.mkdir(dirPath, () => {
                createFile();
              });
            } else {
              createFile();
            }
          });

          return {
            content_hash: metadata.content_hash,
            id: metadata.id,
            name: metadata.name,
            path_display: metadata.path_display,
            path_lower: metadata.path_lower,
            rev: metadata.rev,
            size: metadata.size
          };
        } else {
          return null;
        }
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.response.statusText
        });
        return {};
      }
    }
  }
};
