// eslint-disable-next-line no-unused-vars
import { Dropbox, files } from 'dropbox';
import { ErrorLogger } from '../logger';

export default {
  Query: {
    search: async (obj: any, args: any, context: any, info: any) => {
      try {
        const folderResult: files.SearchResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesSearch({
          max_results: 10,
          path: '',
          query: args.query
        });

        return {
          matches: folderResult.matches.map((x) => {
            return Object.assign({}, x, {
              metadata: Object.assign({}, x.metadata, {
                tag: x.metadata['.tag']
              })
            });
          }),
          more: folderResult.more,
          start: folderResult.start
        };
      } catch (error) {
        ErrorLogger.log(error);
        return {};
      }
    }
  }
};
