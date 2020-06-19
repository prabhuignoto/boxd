/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
import Agenda from 'agenda';
import { Dropbox, files } from 'dropbox';
import agenda from '../agenda';
import { ErrorLogger } from '../logger';
import PubSub from '../pubSub';

export interface Job {
  accessToken: string;
  asyncJobId: string;
}

export interface entry {
  '.tag': string;
  metadata: {
    '.tag': string;
    name: string;
    path_lower: string;
    content_hash: string;
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

function jobFactory<T extends JobInterface>(config: T) {
  return async function (job: Agenda.Job<Job>) {
    const { accessToken, asyncJobId } = job.attrs.data;
    try {
      const client = getClient(accessToken);
      let result: JobStatusResult;

      const process = (result: JobStatusResult) => {
        if (result['.tag'] === 'complete') {
          config.onComplete && config.onComplete({
            entries: (<entry[]>result.entries).map(entry => Object.assign({}, entry, {
              tag: entry['.tag']
            })),
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'complete'
          });
          agenda.cancel({ name: asyncJobId });
        } else if (result['.tag'] === 'in_progress') {
          config.onProgress && config.onProgress({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'running'
          });
        } else if (result['.tag'] === 'failed') {
          config.onFailed && config.onFailed({
            job_id: asyncJobId,
            tag: result['.tag'],
            status: 'failed'
          });
          agenda.cancel({ name: asyncJobId });
        }
      };

      if (config.mode === JobMode.copy) {
        result = await client.filesCopyBatchCheckV2({
          async_job_id: asyncJobId
        });
        process(result);
      } else if (config.mode === JobMode.move) {
        result = await client.filesMoveBatchCheckV2({
          async_job_id: asyncJobId
        });
        process(result);
      } else if (config.mode === JobMode.delete) {
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
          status
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

