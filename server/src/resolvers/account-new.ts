// eslint-disable-next-line no-unused-vars
import { Dropbox, users } from 'dropbox';
import { Ctx, Query, Resolver } from 'type-graphql';
import { ErrorLogger } from '../logger';
import { Account, SpaceUsage } from '../typedefs/account-new';

@Resolver()
export default class AccountResolver {
  @Query(returns => Account)
  async getAccount(@Ctx() context: any) {
    try {
      const accountData: users.BasicAccount = await new Dropbox({
        accessToken: context.session.access_token,
        clientId: process.env.CLIENT_ID
      }).usersGetAccount({
        account_id: context.session.account_id
      });
      return ({
        name: accountData.name
      });
    } catch (error) {
      ErrorLogger.log(error);
      return Promise.resolve(false);
    }
  }

  @Query(returns => SpaceUsage)
  async getSpaceUsage(@Ctx() context: any) {
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
