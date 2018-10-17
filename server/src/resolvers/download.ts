import { Dropbox, files } from "dropbox";
import { createLogger, transports, format } from "winston";
import FS from "fs";
import Path from "path";

const logFormat = format.combine(format.timestamp(), format.prettyPrint());
const errorLogger = createLogger({
  level: "error",
  format: logFormat,
  transports: [new transports.Console()]
});
const infoLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [new transports.Console()]
});

export default {
  Query: {
    downloadFile: async (obj: any, args: any, context: any, info: any) => {
      try {
        type DownloadMetadata = files.FileMetadata & { fileBinary: Buffer };

        infoLogger.log({
          message: `Downloading ${args.path}`,
          level: "info"
        });

        const metadata: DownloadMetadata = (await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesDownload({
          path: args.path
        })) as DownloadMetadata;

        infoLogger.log({
          message: `Downloaded file ${metadata.name}`,
          level: "error"
        });

        const dirName = context.session.account_id.replace(/dbid:/, "");
        const appRoot = Path.join(
          Path.parse(process.mainModule!.filename).dir,
          "../"
        );
        const dirPath = Path.resolve(appRoot, "downloads/" + dirName);
        const filePath = Path.resolve(dirPath, metadata.name);
        infoLogger.log({
          message: `Generating file path ${filePath}`,
          level: "info"
        });

        const createFile = () => {
          FS.exists(filePath, exists => {
            if (!exists) {
              FS.writeFile(filePath, metadata.fileBinary, (err: any) => {
                if (err) {
                  throw new Error("Failed to create the file");
                } else {
                  infoLogger.log({
                    message: `${metadata.name} successfully created on ${filePath}`,
                    level: "info"
                  });
                }
              });
            }
          });
        };

        FS.exists(dirPath, exists => {
          if (!exists) {
            FS.mkdir(dirPath, err => {
              createFile();
            });
          } else {
            createFile();
          }
        });
        
        return {
          name: metadata.name,
          id: metadata.id,
          size: metadata.size,
          path_lower: metadata.path_lower,
          path_display: metadata.path_display,
          content_hash: metadata.content_hash,
          rev: metadata.rev
        };
      } catch (error) {
        errorLogger.log({
          level: "error",
          message: error.response.statusText
        });
        return {};
      }
    }
  }
};
