/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
import Agenda from 'agenda';
// eslint-disable-next-line no-unused-vars
import { Dropbox, files } from 'dropbox';
import agenda from '../agenda';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';

export interface Job {
  accessToken: string;
  asyncJobId: string;
  path: string
}

export interface entry {
  tag: string;
  metadata?: {
    tag: string;
    name?: string;
    path_lower?: string;
    content_hash?: string;
  };
  success?: {
    tag: string;
    name?: string;
    path_lower?: string;
    content_hash?: string;
  }
}

export enum JobMode {
  'copy' = 'copy',
  'move' = 'move',
  'delete' = 'delete',
};

const getClient = (accessToken: string) => new Dropbox({
  accessToken: accessToken,
  clientId: process.env.CLIENT_ID
});

interface JobResult {
  job_id: string;
  tag: string;
  entries?: entry[];
  status?: string;
}

interface JobInterface {
  onComplete(r: JobResult): void;
  onProgress(r: JobResult): void;
  onFailed(r: JobResult): void;
  mode: JobMode
}

type JobStatusResult = files.RelocationBatchV2JobStatus | files.DeleteBatchJobStatus;
type resultEntry = files.RelocationBatchResultEntry | files.DeleteBatchResultEntry;

function jobFactory<T extends JobInterface> (config: T) {
  const transformEntries: (e: resultEntry[], m: JobMode) => entry[] = (entries, mode) => {
    return entries.map(item => {
      let data = null;
      let metaData = null;

      if (mode === JobMode.copy || mode === JobMode.move) {
        data = (<files.RelocationBatchResultEntrySuccess & {success: {id: string}}>item);
        metaData = data.success;
      } else {
        data = (<files.DeleteBatchResultEntrySuccess & {metadata: {id: string }}>item);
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
    const { accessToken, asyncJobId } = job.attrs.data;
    try {
      const client = getClient(accessToken);
      const { onComplete, onProgress, onFailed, mode } = config;
      let result: JobStatusResult;

      const process = (result: JobStatusResult) => {
        if (result['.tag'] === 'complete') {
          onComplete && onComplete({
            entries: transformEntries(result.entries, mode),
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'complete'
          });
          agenda.cancel({ name: asyncJobId });
        } else if (result['.tag'] === 'in_progress') {
          onProgress && onProgress({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'running'
          });
        } else if (result['.tag'] === 'failed') {
          onFailed && onFailed({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'failed'
          });
          agenda.cancel({ name: asyncJobId });
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
      agenda.cancel({ name: asyncJobId });
      ErrorLogger.log(error);
    }
  };
}

const loadJob = function (mode: JobMode) {
  return jobFactory({
    mode,
    onComplete: ({ entries, status, job_id, tag }) => {
      PubSub.publish('dropbox_batch_work_complete', {
        batchWorkComplete: {
          job_id,
          tag,
          entries,
          status,
          job_type: mode
        }
      });
      agenda.cancel({ name: job_id });
    },
    onProgress: ({ status, job_id, tag }) => {
      PubSub.publish('dropbox_batch_work_running', {
        batchWorkRunning: {
          job_id,
          tag,
          status
        }
      });
    },
    onFailed: ({ job_id, tag }) => {
      PubSub.publish('dropbox_batch_work_failed', {
        batchWorkFailed: {
          job_id,
          tag,
          status: 'failed'
        }
      });
      agenda.cancel({ name: job_id });
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
