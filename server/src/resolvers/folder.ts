/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import getDropboxClient from '../dropboxClient';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';

export default {
  Mutation: {
    copyResource: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationResult = await getDropboxClient(
          context.session.access_token,
          process.env.CLIENT_ID as string).filesCopyV2({
          from_path: args.from_path,
          to_path: args.to_path,
          autorename: true
        });
        PubSub.publish('resx_copied', {
          resxCopied: {
            name: args.from_path,
            success: true
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        PubSub.publish('resx_copied', {
          resxCopied: {
            message: 'Failed to copy the resource',
            success: false
          }
        });
        return {};
      }
    },
    createFolder: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.CreateFolderResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesCreateFolderV2({
          autorename: true,
          path: `${args.path}/${args.name}`
        });
        PubSub.publish('folder_added', {
          folderAdded: {
            name: args.name,
            success: true
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        PubSub.publish('folder_added', {
          folderAdded: {
            message: 'Failed to add the folder',
            success: false
          }
        });
        return {};
      }
    },
    deleteFolder: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.DeleteResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesDeleteV2({
          path: args.path
        });
        PubSub.publish('resx_deleted', {
          resxDeleted: {
            name: args.path,
            success: true
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        PubSub.publish('resx_deleted', {
          resxDeleted: {
            message: 'Failed to delete the folder',
            success: false
          }
        });
        return {};
      }
    },
    moveResource: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationResult = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesMoveV2({
          from_path: args.from_path,
          to_path: args.to_path
        });
        PubSub.publish('resx_moved', {
          resxMoved: {
            name: args.from_path,
            success: true
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('resx_moved', {
          resxCopied: {
            message: 'Failed to move the resource',
            success: false
          }
        });
        return {};
      }
    }
  },
  Query: {
    listFolder: async (obj: any, args: any, context: any, info: any) => {
      try {
        let folderResult: files.ListFolderResult | null = null;

        if (!args.cursor) {
          folderResult = await new Dropbox({
            accessToken: context.session.access_token,
            clientId: process.env.CLIENT_ID
          }).filesListFolder({
            include_media_info: true,
            limit: args.limit,
            path: args.path
          });
        } else {
          folderResult = await new Dropbox({
            accessToken: context.session.access_token,
            clientId: process.env.CLIENT_ID
          }).filesListFolderContinue({
            cursor: args.cursor
          });
        }

        return {
          cursor: folderResult.cursor,
          entries: folderResult.entries.map((x) =>
            Object.assign({}, x, {
              tag: x['.tag']
            })
          ),
          hasMore: folderResult.has_more
        };
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        return {};
      }
    }
  },
  Subscription: {
    folderAdded: {
      subscribe: () => PubSub.asyncIterator('folder_added')
    },
    resxCopied: {
      subscribe: () => PubSub.asyncIterator('resx_copied')
    },
    resxDeleted: {
      subscribe: () => PubSub.asyncIterator('resx_deleted')
    },
    resxMoved: {
      subscribe: () => PubSub.asyncIterator('resx_moved')
    }
  }
};
