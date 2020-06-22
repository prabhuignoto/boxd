/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import Agenda from '../agenda';
import { deleteJob, Job, moveJob, copyJob } from '../agendas/batchCheck';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';

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
          PubSub.publish('dropbox_batch_work_complete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'delete',
              ui_job_id: args.options.ui_job_id
            }
          });
        } else if (result['.tag'] === 'async_job_id') {
          await Agenda.define<Job>(result.async_job_id, deleteJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            ui_job_id: args.options.ui_job_id
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('dropbox_batch_work_failed', {
          batchWorkFailed: {
            job_type: 'delete',
            status: 'failure',
            ui_job_id: args.options.ui_job_id
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
            from_path: item.from_path,
            to_path: item.to_path
          })),
          autorename: args.options.autorename
        });

        if (result['.tag'] === 'complete') {
          PubSub.publish('dropbox_batch_work_complete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'move',
              ui_job_id: args.options.ui_job_id
            }
          });
        } else if (result['.tag'] === 'async_job_id') {
          await Agenda.define<Job>(result.async_job_id, moveJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            ui_job_id: args.options.ui_job_id
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('dropbox_batch_work_failed', {
          batchWorkFailed: {
            job_type: 'move',
            status: 'failure',
            ui_job_id: args.options.ui_job_id
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
            from_path: item.from_path,
            to_path: item.to_path
          })),
          autorename: args.options.autorename
        });

        if (result['.tag'] === 'complete') {
          PubSub.publish('dropbox_batch_work_complete', {
            batchWorkComplete: {
              entries: result.entries,
              status: 'completed',
              job_type: 'copy',
              ui_job_id: args.options.ui_job_id

            }
          });
        } else if (result['.tag'] === 'async_job_id') {
          await Agenda.define<Job>(result.async_job_id, copyJob);
          await Agenda.every('3 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id,
            ui_job_id: args.options.ui_job_id
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('dropbox_batch_work_failed', {
          resxDeleted: {
            batchWorkFailed: {
              job_type: 'copy',
              status: 'failure',
              ui_job_id: args.options.ui_job_id
            }
          }
        });
        return Promise.resolve(false);
      }
    }
  },
  Subscription: {
    batchWorkComplete: {
      subscribe: () => PubSub.asyncIterator('dropbox_batch_work_complete')
    },
    batchWorkRunning: {
      subscribe: () => PubSub.asyncIterator('dropbox_batch_work_running')
    },
    batchWorkFailed: {
      subscribe: () => PubSub.asyncIterator('dropbox_batch_work_failed')
    }
  }
};
