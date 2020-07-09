/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import { Arg, Ctx, Field, Float, InputType, Mutation, Query, Resolver } from 'type-graphql';
import getDropboxClient from '../modules/dropboxClient';
import { ErrorLogger } from '../modules/logger';
import Pusher from '../modules/pusher';
import { Folder } from '../typedefs/folder-new';
import { Metadata } from '../typedefs/metadata-new';

@InputType()
class FilesRelocationArg {
  @Field()
  fromPath!: string;

  @Field()
  toPath!: string;

  @Field({ nullable: true })
  autorename?: boolean;

  @Field()
  uiJobId!: string;
}

@InputType()
class CreateFolderArg {
  @Field()
  path!: string;

  @Field({ nullable: true })
  autorename?: boolean;

  @Field()
  uiJobId!: string;

  @Field()
  name!: string;
}

@InputType()
class DeleteFolderArg {
  @Field()
  path!: string;
}

@InputType()
class ListFilesArg {
  @Field(returns => Float)
  limit!: number;

  @Field()
  path!: string;

  @Field()
  cursor!: string;
}

@InputType()
class Context {
  session!: {
    // eslint-disable-next-line camelcase
    access_token: string
  }
}

@Resolver()
export default class FolderResolver {
  @Query(returns => Folder)
  async listFolder(
    @Arg('args') args: ListFilesArg,
    @Ctx() context: Context
  ) {
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

  @Mutation(returns => Metadata)
  async copyResource(
    @Arg('args') args: FilesRelocationArg,
    @Ctx() context: Context
  ) {
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
  }

  @Mutation(returns => Metadata)
  async createFolder(@Arg('args') args: CreateFolderArg, @Ctx() context: Context) {
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
  }

  @Mutation(returns => Metadata)
  async deleteFolder(@Arg('args') args: DeleteFolderArg, @Ctx() context: Context) {
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
  }

  @Mutation(returns => Metadata)
  async moveResource(@Arg('args') args: FilesRelocationArg, @Ctx() context: Context) {
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
}
