import { Dropbox, files } from "dropbox";
import { createLogger, transports, format } from "winston";

const logFormat = format.combine(
  format.prettyPrint(),
  format.colorize(),
)

const errorLogger = createLogger({
  level: "error",
  format: logFormat,
  transports: [new transports.Console()]
});

export default {
  Query: {
    getPreview: async(obj: any, args: any, context: any, info: any) => {
      try {
        const previewData: files.FileMetadata = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesGetPreview({
          path: args.path
        });
        return {
          name: previewData.name
        }
      } catch (error) {
        errorLogger.log(error);
        return {};
      }
    }
  }
}