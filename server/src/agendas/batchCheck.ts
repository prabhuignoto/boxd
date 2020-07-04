/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
import Agenda from 'agenda';
// eslint-disable-next-line no-unused-vars
import { JobInterface, JobMode, entry, entry_error, resultEntry, JobStatusResult, Job } from './agenda-models';
// eslint-disable-next-line no-unused-vars
import { Dropbox, files } from 'dropbox';
import agenda from '../agenda';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';

const getClient = (accessToken: string) => new Dropbox({
  accessToken: accessToken,
  clientId: process.env.CLIENT_ID
});

function jobFactory<T extends JobInterface> (config: T) {
  const transformEntries: (e: resultEntry[], m: JobMode) => entry[] | entry_error[] = (entries, mode) => {
    return entries.map(item => {
      let data = null;
      let metaData = null;

      if (item['.tag'] === 'failure') {
        return {
          tag: 'failure',
          reason: item.failure['.tag']
        };
      } else if (mode === JobMode.copy || mode === JobMode.move) {
        data = (<files.RelocationBatchResultEntrySuccess & { success: { id: string } }>item);
        metaData = data.success;
      } else {
        data = (<files.DeleteBatchResultEntrySuccess & { metadata: { id: string } }>item);
        metaData = data.metadata;
      }

      return {
        tag: item['.tag'],
        metadata: {
          id: metaData.id,
          tag: data['.tag'],
          name: metaData.name,
          path_lower: metaData.path_lower,
          path_display: metaData.path_display
        }
      };
    });
  };

  return async function (job: Agenda.Job<Job>) {
    const { accessToken, asyncJobId, uiJobId } = job.attrs.data;
    try {
      const client = getClient(accessToken);
      const { onComplete, onProgress, onFailed, mode } = config;
      let result: JobStatusResult;

      const process = (result: JobStatusResult) => {
        if (result['.tag'] === 'complete') {
          const entries = transformEntries(result.entries, mode);
          const failureOccured = entries.some((e: entry | entry_error) => e.tag === 'failure');

          if (!failureOccured) {
            onComplete && onComplete({
              entries,
              job_id: asyncJobId,
              tag: result['.tag'],
              status: 'complete',
              uiJobId
            });
          } else {
            onFailed && onFailed({
              job_id: asyncJobId,
              tag: result['.tag'],
              status: 'failed',
              uiJobId
            });
          }
        } else if (result['.tag'] === 'in_progress') {
          onProgress && onProgress({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'running',
            uiJobId
          });
        } else if (result['.tag'] === 'failed') {
          onFailed && onFailed({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'failed',
            uiJobId
          });
        }
      };

      if (mode === JobMode.copy) {
        result = await client.filesCopyBatchCheckV2({
          async_job_id: asyncJobId
        });
        process(result);
      } else if (mode === JobMode.move) {
        result = await client.filesMoveBatchCheckV2({
          async_job_id: asyncJobId
        });
        process(result);
      } else if (mode === JobMode.delete) {
        result = await client.filesDeleteBatchCheck({
          async_job_id: asyncJobId
        });
        process(result);
      }
    } catch (error) {
      agenda && agenda.cancel({ name: asyncJobId });
      ErrorLogger.log(error);
    }
  };
}

const loadJob = function (mode: JobMode) {
  return jobFactory({
    mode,
    onComplete: ({ entries, status, job_id, tag, uiJobId }) => {
      PubSub.publish('batchWorkComplete', {
        batchWorkComplete: {
          job_id,
          tag,
          entries,
          status,
          job_type: mode,
          uiJobId
        }
      });
      agenda && agenda.cancel({ name: job_id });
    },
    onProgress: ({ status, job_id, tag, uiJobId }) => {
      PubSub.publish('batchWorkRunning', {
        batchWorkRunning: {
          job_id,
          tag,
          status,
          uiJobId
        }
      });
    },
    onFailed: ({ job_id, tag, uiJobId }) => {
      PubSub.publish('batchWorkFailed', {
        batchWorkFailed: {
          job_id,
          tag,
          status: 'failed',
          uiJobId,
          job_type: mode
        }
      });
      agenda && agenda.cancel({ name: job_id });
    }
  });
};

const copyJob = loadJob(JobMode.copy);
const moveJob = loadJob(JobMode.move);
const deleteJob = loadJob(JobMode.delete);

export {
  copyJob,
  moveJob,
  deleteJob
};
