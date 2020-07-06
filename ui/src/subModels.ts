import {
  VueApolloSubscriptionDefinition,
  VueApolloSubscriptionProperty,
} from "vue-apollo/types/options";
import { Dispatch } from "vuex";
import { JobData, JobType } from "./modules/jobs";

export interface SocketResponse {
  success: boolean;
  name: string;
  fileName?: string;
  uiJobId: string;
  job_type?: string;
  status?: string;
  path?: string;
}

export interface SocketDataResponse {
  data: {
    [key: string]: SocketResponse;
  };
}

export interface Notification {
  type: string;
  notificationTitle?: string;
  id: string;
  message: string;
}

export interface Job {
  id?: string;
  reason?: string;
}

export type SubscriptionDefinition = VueApolloSubscriptionDefinition & {
  result({ data: { T: SocketResponse } }: SocketDataResponse): void;
  showNotification(n: Notification): void;
  completeJob(j: { id: string }): void;
  failedJob(j: { id: string; reason?: string }): void;
};

export interface Item {
  id: string;
  fromPath: string;
  toPath: string;
  pathLower: string;
}

export type SubscriptionProperty = VueApolloSubscriptionProperty & {
  batchWorkComplete: SubscriptionDefinition & {
    getExplorerPath: string;
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    getJobDataById: (id?: string) => JobData;
    addJob: (j: { jobType: JobType; data: unknown }) => Dispatch;
    stopBulkOps: ({ jobId: string }) => Dispatch;
    deleteNodes: ({
      treeId,
      nodes,
      fromPath,
    }: {
      treeId: string;
      nodes: string[];
      fromPath: string;
    }) => Dispatch;
    removeChildrenNodes: ({
      treeId,
      nodes,
      fromPath,
    }: {
      treeId: string;
      nodes: string[];
      fromPath: string;
    }) => Dispatch;
  };
  batchWorkRunning: SubscriptionDefinition;
  batchWorkFailed: SubscriptionDefinition & {
    stopBulkOps: ({ jobId: string }) => Dispatch;
  };
  uploadCompleted: SubscriptionDefinition & {
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    addJob: (j: { jobType: JobType; data: unknown }) => Dispatch;
    getExplorerPath: string;
  };
  folderAdded: SubscriptionDefinition & {
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    getExplorerPath: string;
    getJobDataById: (id?: string) => JobData;
    addJob: (j: { jobType: JobType; data: unknown }) => Dispatch;
  };
};
