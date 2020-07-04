/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
import { files } from 'dropbox';

export interface Job {
  accessToken: string;
  asyncJobId: string;
  path: string;
  uiJobId: string;
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

export interface entry_error {
  tag: string;
  reason: string;
}

export enum JobMode {
  'copy' = 'copy',
  'move' = 'move',
  'delete' = 'delete',
};

export interface JobResult {
  job_id: string;
  tag: string;
  entries?: entry[];
  status?: string;
  uiJobId?: string;
}

export interface JobInterface {
  onComplete(r: JobResult): void;
  onProgress(r: JobResult): void;
  onFailed(r: JobResult): void;
  mode: JobMode
}

export type JobStatusResult = files.RelocationBatchV2JobStatus | files.DeleteBatchJobStatus;
export type resultEntry = files.RelocationBatchResultEntry | files.DeleteBatchResultEntry;
