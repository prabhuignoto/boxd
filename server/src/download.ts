import { Dropbox, files } from "dropbox";
import { Request, Response } from "express";
import FS from "graceful-fs";
import Path from "path";
import { createLogger, format, transports } from "winston";

const logFormat = format.combine(format.timestamp(), format.prettyPrint());
const errorLogger = createLogger({
  format: logFormat,
  level: "error",
  transports: [new transports.Console()],
});
const infoLogger = createLogger({
  format: logFormat,
  level: "info",
  transports: [new transports.Console()],
});

export default async function Download(req: Request, resp: Response) {
  try {
    type DownloadMetadata = files.FileMetadata & { fileBinary: Buffer };

    infoLogger.log({
      level: "info",
      message: `Downloading ${req.query.path}`,
    });

    if (req.session && req.session.access_token) {
      const metadata: DownloadMetadata = (await new Dropbox({
        accessToken: req.session.access_token,
        clientId: process.env.CLIENT_ID,
      }).filesDownload({
        path: req.query.path,
      })) as DownloadMetadata;

      infoLogger.log({
        level: "error",
        message: `Downloaded file ${metadata.name}`,
      });

      const dirName = req.session.account_id.replace(/dbid:/, "");
      const appRoot = Path.join(
        Path.parse(process.mainModule!.filename).dir,
        "../",
      );
      const dirPath = Path.resolve(appRoot, "downloads/" + dirName);
      const filePath = Path.resolve(dirPath, metadata.name);
      infoLogger.log({
        level: "info",
        message: `Generating file path ${filePath}`,
      });

      const createFile = () => {
        FS.exists(filePath, (exists) => {
          if (!exists) {
            FS.writeFile(filePath, metadata.fileBinary, (err: any) => {
              if (err) {
                throw new Error("Failed to create the file");
              } else {
                infoLogger.log({
                  level: "info",
                  message: `${
                    metadata.name
                  } successfully created on ${filePath}`,
                });
              }
            });
          }
          resp.download(filePath, metadata.name);
        });
      };

      FS.exists(dirPath, (exists) => {
        if (!exists) {
          FS.mkdir(dirPath, (err) => {
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
      message: error.response.statusText,
    });
    return {};
  }
}
