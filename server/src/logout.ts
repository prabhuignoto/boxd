import { Dropbox } from "dropbox";
import { Request, Response } from "express";
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

// tslint: disable-next-line
export default async function Logout(req: Request, resp: Response) {
  try {
    infoLogger.log({
      level: "info",
      message: `Uploading ${req.query.path}`,
    });
    await new Dropbox({
      accessToken: req.session!.access_token,
      clientId: process.env.CLIENT_ID,
    }).authTokenRevoke(undefined);

    if (req.session) {
      req.session.destroy(() => {
        infoLogger.log({
          level: "info",
          message: `Session destroyed`,
        });
      });
    }

    return resp.json({
      message: "Successfully logged out",
      success: true,
    });
  } catch (error) {
    errorLogger.log({
      level: "error",
      message: error.response.statusText,
    });
    return resp.send({
      message: "Failed to log out",
      success: false,
    });
  }
}
