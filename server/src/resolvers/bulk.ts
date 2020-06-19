/* eslint-disable no-unused-vars */
import { Dropbox, files } from 'dropbox';
import Agenda from '../agenda';
import { deleteJob, Job } from '../agendas/batchCheck';
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
              status: 'completed'
            }
          });
        } else if (result['.tag'] === 'async_job_id') {
          await Agenda.define<Job>(result.async_job_id, deleteJob);
          await Agenda.every('4 seconds', result.async_job_id, {
            accessToken: context.session.access_token,
            asyncJobId: result.async_job_id
          });
        }
        return Promise.resolve(true);
      } catch (error) {
        ErrorLogger.log(error);
        PubSub.publish('resx_deleted', {
          resxDeleted: {
            message: 'Failed to delete the folder',
            success: false
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
