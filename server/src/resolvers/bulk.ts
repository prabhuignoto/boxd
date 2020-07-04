/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import Agenda from '../agenda';
import { copyJob, deleteJob, moveJob } from '../agendas/batchCheck';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';
import { Job } from '../agendas/agenda-models';

export default {
  Mutation: {
    deleteBulk: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.DeleteBatchLaunch = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesDeleteBatch({
          entries: args.options.paths.map((p: any) => ({
            path: p
          }))
        });

        if (result['.tag'] === 'complete') {
          PubSub.publish('batchWorkComplete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'delete',
              uiJobId: args.options.uiJobId
            }
          });
        } else if (result['.tag'] === 'async_job_id' && Agenda) {
          await Agenda.define<Job>(result.async_job_id, deleteJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            uiJobId: args.options.uiJobId
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('batchWorkFailed', {
          batchWorkFailed: {
            job_type: 'delete',
            status: 'failure',
            uiJobId: args.options.uiJobId
          }
        });
        return Promise.resolve(false);
      }
    },
    moveBulk: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationBatchV2Launch = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesMoveBatchV2({
          entries: args.options.entries.map((item: any) => ({
            from_path: item.fromPath,
            to_path: item.toPath
          })),
          autorename: args.options.autorename
        });

        if (result['.tag'] === 'complete') {
          PubSub.publish('batchWorkComplete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'move',
              uiJobId: args.options.uiJobId
            }
          });
        } else if (result['.tag'] === 'async_job_id' && Agenda) {
          await Agenda.define<Job>(result.async_job_id, moveJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            uiJobId: args.options.uiJobId
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('batchWorkFailed', {
          batchWorkFailed: {
            job_type: 'move',
            status: 'failure',
            uiJobId: args.options.uiJobId
          }
        });
        return Promise.resolve(false);
      }
    },
    copyBulk: async (obj: any, args: any, context: any, info: any) => {
      try {
        const result: files.RelocationBatchV2Launch = await new Dropbox({
          accessToken: context.session.access_token,
          clientId: process.env.CLIENT_ID
        }).filesCopyBatchV2({
          entries: args.options.entries.map((item: any) => ({
            from_path: item.fromPath,
            to_path: item.toPath
          })),
          autorename: args.options.autorename
        });

        if (result['.tag'] === 'complete') {
          PubSub.publish('batchWorkComplete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'copy',
              uiJobId: args.options.uiJobId

            }
          });
        } else if (result['.tag'] === 'async_job_id' && Agenda) {
          await Agenda.define<Job>(result.async_job_id, copyJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            uiJobId: args.options.uiJobId
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('batchWorkFailed', {
          resxDeleted: {
            batchWorkFailed: {
              job_type: 'copy',
              status: 'failure',
              uiJobId: args.options.uiJobId
            }
          }
        });
        return Promise.resolve(false);
      }
    }
  },
  Subscription: {
    batchWorkComplete: {
      subscribe: () => PubSub.asyncIterator('batchWorkComplete')
    },
    batchWorkRunning: {
      subscribe: () => PubSub.asyncIterator('batchWorkRunning')
    },
    batchWorkFailed: {
      subscribe: () => PubSub.asyncIterator('batchWorkFailed')
    }
  }
};
