import pubsub from './pubSub';
import { Request, Response } from "express";
import { Dropbox } from "dropbox";
import { createLogger, transports, format } from "winston";
import FS from "fs";

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

// tslint: disable-next-line
export default function Upload(req: Request, resp: Response) {
  try {
    const files: any = req.files;
    infoLogger.log({
      message: `Uploading ${files[0].originalname} to ${req.body.uploadPath}`,
      level: "info"
    });
    FS.readFile(files[0].path, "utf8", function(err, contents) {
      const response = new Dropbox({
        accessToken: req.session!.access_token,
        clientId: process.env.CLIENT_ID,
      }).filesUpload({
        contents: contents,
        autorename: true,
        path: `${req.body.uploadPath}/${files[0].originalname}`
      });
      response
        .then(data => {
          resp.json({
            success: true,
            status: "completed",
            status_text: "File uploaded successfully."
          });
          pubsub.publish("upload_completed", {
            fileUploaded: {
              success: true,
              fileName: files[0].originalname as string
            }
          })
        })
        .catch(error => {
          resp.json({
            success: false,
            status: "failed",
            status_text: "Upload failed."
          });
          pubsub.publish("upload_completed", {
            fileUploaded: {
              success: false,
              message: "Failed to upload the file"
            }
          })
        });
    });

    return true;
  } catch (error) {
    errorLogger.log({
      level: "error",
      message: error.response.statusText
    });
    return resp.json({
      success: false,
      status: "failed",
      status_text: "Upload failed"
    });
  }
}
