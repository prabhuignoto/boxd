import { Request, Response } from "express";
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

export default async function Download(req: Request, resp: Response) {
  try {
    type DownloadMetadata = files.FileMetadata & { fileBinary: Buffer };

    infoLogger.log({
      message: `Downloading ${req.query.path}`,
      level: "info"
    });

    if(req.session && req.session.access_token) {
      const metadata: DownloadMetadata = (await new Dropbox({
        accessToken: req.session.access_token,
        clientId: process.env.CLIENT_ID
      }).filesDownload({
        path: req.query.path
      })) as DownloadMetadata;
  
      infoLogger.log({
        message: `Downloaded file ${metadata.name}`,
        level: "error"
      });
  
      const dirName = req.session.account_id.replace(/dbid:/, "");
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
          resp.download(filePath, metadata.name);
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
    }
    return {};
  } catch (error) {
    errorLogger.log({
      level: "error",
      message: error.response.statusText
    });
    return {};
  }
}