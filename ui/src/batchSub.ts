/* eslint-disable @typescript-eslint/no-unused-vars */
import gql from "graphql-tag";
import uniqid from "uniqid";
import { Job, Notification, SocketDataResponse } from "./subModels";
import {
  VueApolloSubscriptionDefinition,
  VueApolloSubscriptionProperty,
} from "vue-apollo/types/options";

type SubscriptionDefinition = VueApolloSubscriptionDefinition & {
  result({ data: { T: SocketResponse } }: SocketDataResponse): void;
  showNotification(n: Notification): void;
  completeJob(j: Job): void;
  failedJob(j: Job): void;
};

type SubscriptionProperty = VueApolloSubscriptionProperty & {
  batchWorkComplete: SubscriptionDefinition & {
    getExplorerPath: string;
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    unLockItems(d: { jobId?: string; failed?: boolean }): void;
  };
  batchWorkRunning: SubscriptionDefinition;
  batchWorkFailed: SubscriptionDefinition & {
    unLockItems(d: { jobId?: string; failed: boolean }): void;
  };
  uploadCompleted: SubscriptionDefinition & {
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    getExplorerPath: string;
    refetchData(b: boolean): void;
  };
  folderAdded: SubscriptionDefinition & {
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    getExplorerPath: string;
    refetchData(b: boolean): void;
    unLockItems(d: { jobId?: string; failed: boolean }): void;
  };
};

export default {
  batchWorkComplete: {
    query: gql`
      subscription {
        batchWorkComplete {
          job_id
          status
          job_type
          uiJobId
          entries {
            metadata {
              id
              name
              path_lower
            }
          }
        }
      }
    `,
    result({ data: { batchWorkComplete } }) {
      const jobType = batchWorkComplete.job_type;
      const status = batchWorkComplete.status;
      const uiJobId = batchWorkComplete.uiJobId;
      this.unLockItems({ jobId: uiJobId });

      this.refreshFileExplorer({
        status: true,
        path: this.getExplorerPath,
      });

      if (status === "complete") {
        this.completeJob({ id: uiJobId });
        this.showNotification({
          type: "info",
          id: uniqid("notification-msg-"),
          message: `Files ${jobType}d successfully`,
        });
      } else {
        this.failedJob({ id: uiJobId, reason: "failure" });
        this.showNotification({
          type: "failure",
          id: uniqid("notification-msg-"),
          message: `The ${jobType} successfully`,
        });
      }
    },
  },
  batchWorkRunning: {
    query: gql`
      subscription {
        batchWorkRunning {
          job_id
          status
          job_type
          uiJobId
          entries {
            metadata {
              id
              name
              path_lower
            }
          }
        }
      }
    `,
    result({ data: { batchWorkRunning } }) {
      console.log(batchWorkRunning);
    },
  },
  batchWorkFailed: {
    query: gql`
      subscription {
        batchWorkFailed {
          job_id
          status
          job_type
          uiJobId
          entries {
            metadata {
              id
              name
              path_lower
            }
          }
        }
      }
    `,
    result({ data: { batchWorkFailed } }) {
      const jobType = batchWorkFailed.job_type;
      // const status = batchWorkFailed.status;
      const uiJobId = batchWorkFailed.uiJobId;

      this.unLockItems({ jobId: uiJobId, failed: true });
      this.failedJob({ id: uiJobId });

      this.showNotification({
        type: "failure",
        id: uniqid("notification-msg-"),
        message: `The ${jobType} job failed.`,
      });
    },
  },
  folderAdded: {
    query: gql`
      subscription {
        folderAdded {
          success
          name
          uiJobId
        }
      }
    `,
    result({ data: { folderAdded } }) {
      debugger;
      if (folderAdded.success) {
        this.completeJob({ id: folderAdded.uiJobId });
        this.showNotification({
          type: "info",
          id: uniqid("notification-msg-"),
          message: `Created ${folderAdded.name} successfully.`,
        });
        this.refetchData(true);
        this.refreshFileExplorer({
          status: true,
          path: this.getExplorerPath,
        });
      } else {
        this.failedJob({ id: folderAdded.uiJobId });
        this.showNotification({
          type: "failure",
          id: uniqid("notification-msg-"),
          message: `Failed to create the folder ${folderAdded.name}.`,
        });
      }
    },
  },
  uploadCompleted: {
    query: gql`
      subscription {
        fileUploaded {
          success
          fileName
          uiJobId
        }
      }
    `,
    result({ data: { fileUploaded } }) {
      if (fileUploaded.success) {
        this.completeJob({ id: fileUploaded.uiJobId });

        this.showNotification({
          type: "info",
          id: uniqid("notification-msg-"),
          message: `Uploaded ${fileUploaded.fileName} successfully.`,
        });

        this.refetchData(true);
        this.refreshFileExplorer({
          status: true,
          path: this.getExplorerPath,
        });
      } else {
        this.failedJob({ id: fileUploaded.uiJobId });

        this.showNotification({
          type: "failure",
          id: uniqid("notification-msg-"),
          message: `Could not upload ${fileUploaded.fileName}.`,
        });
      }
    },
  },
} as SubscriptionProperty;
