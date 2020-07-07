/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import Agenda from '../agenda';
import { Job } from '../agendas/agenda-models';
import { copyJob, deleteJob, moveJob } from '../agendas/batchCheck';
import { ErrorLogger } from '../logger';
import Pusher from '../pusher';

@InputType()
class Entry {
  @Field()
  fromPath!: string;

  @Field()
  toPath!: string;

  @Field()
  id!: string;
}

@InputType()
class DeleteBulkArgs {
  @Field(returns => [String])
  paths!: string[];

  @Field()
  uiJobId!: string;
}

@InputType()
class RelocationBulkArgs {
  @Field({nullable: true})
  autorename?: boolean;

  @Field()
  uiJobId!: string;

  @Field(returns => [Entry])
  entries!: Entry[]
}

@InputType()
class Context {
  session!: {
    // eslint-disable-next-line camelcase
    access_token: string
  }
}

@Resolver()
export default class BulResolver {
  @Mutation(returns => Boolean)
  async deleteBulk(
    @Arg('args') args: DeleteBulkArgs,
    @Ctx() context: Context
  ) {
    try {
      const result: files.DeleteBatchLaunch = await new Dropbox({
        accessToken: context.session.access_token,
        clientId: process.env.CLIENT_ID
      }).filesDeleteBatch({
        entries: args.paths.map((p: any) => ({
          path: p
        }))
      });

      if (result['.tag'] === 'complete') {
        Pusher && Pusher.trigger('channel-batch', 'batchWorkComplete', {
          batchWorkComplete: {
            entries: result.entries,
            status: 'completed',
            job_type: 'delete',
            uiJobId: args.uiJobId
          }
        });
      } else if (result['.tag'] === 'async_job_id' && Agenda) {
        await Agenda.define<Job>(result.async_job_id, deleteJob);
        await Agenda.every('3 seconds', result.async_job_id, {
          accessToken: context.session.access_token,
          asyncJobId: result.async_job_id,
          uiJobId: args.uiJobId
        });
      }
      return Promise.resolve(true);
    } catch (error) {
      ErrorLogger.log(error);
      Pusher && Pusher.trigger('channel-batch', 'batchWorkFailed', {
        batchWorkFailed: {
          job_type: 'delete',
          status: 'failure',
          uiJobId: args.uiJobId
        }
      });
      return Promise.resolve(false);
    }
  }

  @Mutation(returns => Boolean)
  async moveBulk(
    @Arg('args') args: RelocationBulkArgs,
    @Ctx() context: Context
  ) {
    try {
      const result: files.RelocationBatchV2Launch = await new Dropbox({
        accessToken: context.session.access_token,
        clientId: process.env.CLIENT_ID
      }).filesMoveBatchV2({
        entries: args.entries.map(item => ({
          from_path: item.fromPath,
          to_path: item.toPath
        })),
        autorename: args.autorename
      });

      if (result['.tag'] === 'complete') {
        Pusher && Pusher.trigger('channel-batch', 'batchWorkComplete', {
          batchWorkComplete: {
            entries: result.entries,
            status: 'completed',
            job_type: 'move',
            uiJobId: args.uiJobId
          }
        });
      } else if (result['.tag'] === 'async_job_id' && Agenda) {
        await Agenda.define<Job>(result.async_job_id, moveJob);
        await Agenda.every('3 seconds', result.async_job_id, {
          accessToken: context.session.access_token,
          asyncJobId: result.async_job_id,
          uiJobId: args.uiJobId
        });
      }
      return Promise.resolve(true);
    } catch (error) {
      ErrorLogger.log(error);
      Pusher && Pusher.trigger('channel-batch', 'batchWorkFailed', {
        batchWorkFailed: {
          job_type: 'move',
          status: 'failure',
          uiJobId: args.uiJobId
        }
      });
      return Promise.resolve(false);
    }
  }

  @Mutation(returns => Boolean)
  async copyBulk(
    @Arg('args') args: RelocationBulkArgs,
    @Ctx() context: Context
  ) {
    try {
      const result: files.RelocationBatchV2Launch = await new Dropbox({
        accessToken: context.session.access_token,
        clientId: process.env.CLIENT_ID
      }).filesCopyBatchV2({
        entries: args.entries.map(item => ({
          from_path: item.fromPath,
          to_path: item.toPath
        })),
        autorename: args.autorename
      });

      if (result['.tag'] === 'complete') {
        Pusher && Pusher.trigger('channel-batch', 'batchWorkComplete', {
          batchWorkComplete: {
            entries: result.entries,
            status: 'completed',
            job_type: 'copy',
            uiJobId: args.uiJobId

          }
        });
      } else if (result['.tag'] === 'async_job_id' && Agenda) {
        await Agenda.define<Job>(result.async_job_id, copyJob);
        await Agenda.every('3 seconds', result.async_job_id, {
          accessToken: context.session.access_token,
          asyncJobId: result.async_job_id,
          uiJobId: args.uiJobId
        });
      }
      return Promise.resolve(true);
    } catch (error) {
      ErrorLogger.log(error);
      Pusher && Pusher.trigger('channel-batch', 'batchWorkFailed', {
        batchWorkFailed: {
          job_type: 'copy',
          status: 'failure',
          uiJobId: args.uiJobId
        }
      });
      return Promise.resolve(false);
    }
  }
}
