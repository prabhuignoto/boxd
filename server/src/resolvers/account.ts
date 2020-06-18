// eslint-disable-next-line no-unused-vars
import { Dropbox, users } from 'dropbox';

import { ErrorLogger } from '../logger';

export default {
  Query: {
    getAccount: async (obj: any, args: any, context: any, info: any) => {
      try {
        const accountData: users.BasicAccount = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).usersGetAccount({
          account_id: context.session.account_id
        });
        return {
          name: accountData.name
        };
      } catch (error) {
        ErrorLogger.log(error);
        return {};
      }
    },
    getSpaceUsage: async (obj: any, args: any, context: any, info: any) => {
      try {
        const spaceData: users.SpaceUsage = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).usersGetSpaceUsage(undefined);

        return {
          used: spaceData.used,
          allocation: spaceData.allocation
        };
      } catch (error) {
        ErrorLogger.log(error);
        return {};
      }
    }
  }
};
