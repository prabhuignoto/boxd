/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import getDropboxClient from '../dropboxClient';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';
import Pusher from '../pusher';

export default {
  Mutation: {
    copyResource: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationResult = await getDropboxClient(
          context.session.access_token,
          process.env.CLIENT_ID as string).filesCopyV2({
          from_path: args.fromPath,
          to_path: args.toPath,
          autorename: true
        });
        Pusher && Pusher.trigger('channel-files', 'resxCopied', {
          resxCopied: {
            name: args.fromPath,
            success: true
          }
        });

        return result.metadata;
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        Pusher && Pusher.trigger('channel-files', 'resxCopied', {
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
        Pusher && Pusher.trigger('channel-files', 'folderAdded', {
          folderAdded: {
            name: args.name,
            path: args.path,
            success: true,
            uiJobId: args.uiJobId
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log({
          level: 'error',
          message: error.message
        });
        Pusher && Pusher.trigger('channel-files', 'folderAdded', {
          folderAdded: {
            name: args.name,
            message: 'Failed to add the folder',
            success: false,
            uiJobId: args.uiJobId
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
        Pusher && Pusher.trigger('channel-files', 'resxDeleted', {
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
        Pusher && Pusher.trigger('channel-files', 'resxDeleted', {
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
          from_path: args.fromPath,
          to_path: args.toPath
        });
        Pusher && Pusher.trigger('channel-files', 'resxMoved', {
          resxMoved: {
            name: args.fromPath,
            success: true
          }
        });
        return result.metadata;
      } catch (error) {
        ErrorLogger.log(error);
        Pusher && Pusher.trigger('channel-files', 'resxMoved', {
          resxMoved: {
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
  }
};
