// eslint-disable-next-line no-unused-vars
import { Dropbox, files } from 'dropbox';

import { ErrorLogger } from '../logger';

export default {
  Query: {
    getPreview: async (obj: any, args: any, context: any, info: any) => {
      try {
        const previewData: files.FileMetadata = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesGetPreview({
          path: args.path
        });
        return {
          name: previewData.name
        };
      } catch (error) {
        ErrorLogger.log(error);
        return {};
      }
    }
  }
};
