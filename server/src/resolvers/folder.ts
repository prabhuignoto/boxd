import { Dropbox, files } from "dropbox";
import { createLogger, transports } from "winston";
const errorLogger = createLogger({
  level: "error",
  transports: [new transports.Console()]
});

export default {
  Query: {
    listFolder: async (obj: any, args: any, context: any, info: any) => {
      try {
        const folderResult:files.ListFolderResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesListFolder({
          limit: 50,
          path: args.path,
          include_media_info: true,
        });

        return {
          entries: folderResult.entries.map(x => Object.assign({}, x, {
            tag: x[".tag"]
          })),
          hasMore: folderResult.has_more,
          cursor: folderResult.cursor
        }
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    }
  },
  Mutation: { 
    createFolder: async(obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.CreateFolderResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesCreateFolderV2({
          autorename: true,
          path: `${args.path}/${args.name}`,
        });
        return result.metadata;
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    },
    deleteFolder: async(obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.DeleteResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesDeleteV2({
          path: args.path
        });
        return result.metadata;
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    },
    moveResource: async(obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesMoveV2({
          from_path: args.from_path,
          to_path: args.to_path
        });
        return result.metadata;
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    },
    copyResource: async(obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesCopyV2({
          from_path: args.from_path,
          to_path: args.to_path,
        });
        return result.metadata;
      } catch (error) {
        errorLogger.log(error);
        return {}
      }
    }
  }
}