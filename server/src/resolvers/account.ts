import { Dropbox, users } from "dropbox";
import { createLogger, format, transports } from "winston";

const logFormat = format.combine(
  format.prettyPrint(),
  format.colorize(),
);

const errorLogger = createLogger({
  format: logFormat,
  level: "error",
  transports: [new transports.Console()],
});

export default {
  Query: {
    getAccount: async (obj: any, args: any, context: any, info: any) => {
      try {
        const accountData: users.BasicAccount = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID,
        }).usersGetAccount({
          account_id: context.session.account_id,
        });
        return {
          name: accountData.name,
        };
      } catch (error) {
        errorLogger.log(error);
        return {};
      }
    },
    getSpaceUsage: async (obj: any, args: any, context: any, info: any) => {
      try {
        const spaceData: users.SpaceUsage = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID,
        }).usersGetSpaceUsage(undefined);

        return {
          used: spaceData.used,
          allocation: spaceData.allocation,
        };
      } catch (error) {
        errorLogger.log(error);
        return {};
      }
    },
  },
};
