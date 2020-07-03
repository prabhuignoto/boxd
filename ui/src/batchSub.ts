/* eslint-disable @typescript-eslint/no-unused-vars */
import gql from "graphql-tag";
import _ from "lodash";
import uniqid from "uniqid";
import {
  VueApolloSubscriptionDefinition,
  VueApolloSubscriptionProperty,
} from "vue-apollo/types/options";
import { Dispatch } from "vuex";
import { JobData, JobType } from "./modules/jobs";
import { Notification, SocketDataResponse } from "./subModels";

type SubscriptionDefinition = VueApolloSubscriptionDefinition & {
  result({ data: { T: SocketResponse } }: SocketDataResponse): void;
  showNotification(n: Notification): void;
  completeJob(j: { id: string }): void;
  failedJob(j: { id: string; reason?: string }): void;
};

interface Item {
  id: string;
  fromPath: string;
  toPath: string;
  pathLower: string;
}

type SubscriptionProperty = VueApolloSubscriptionProperty & {
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

      const getPath = (path: string) => path.split("/").slice(0, -1).join("/");

      const data: JobData = this.getJobDataById(uiJobId);
      const items = data.items as Item[];
      const item = _.first(items);

      if (item && jobType === "move") {
        const src = getPath(item.fromPath);
        // this.addJob({
        //   jobType: JobType.LIST_FILES,
        //   data: {
        //     path: src,
        //     treeId: "explorer-main",
        //   },
        // });
        this.removeChildrenNodes({
          treeId: data.treeId,
          fromPath: src ? src : "/",
          nodes: items.map(i => i.id),
        });
      } else if (item && jobType === "delete") {
        const fromPath = getPath(item.pathLower ? item.pathLower : "/");
        this.deleteNodes({
          treeId: data.treeId,
          fromPath: fromPath ? fromPath : "/",
          nodes: items.map(i => i.id),
        });
        this.stopBulkOps({ jobId: uiJobId });
      } else {
        this.stopBulkOps({ jobId: uiJobId });
      }

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

      this.stopBulkOps({ jobId: uiJobId });
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
      if (folderAdded.success) {
        const jobId = folderAdded.uiJobId;
        const jobData = this.getJobDataById(jobId);

        // mark job as completed
        this.completeJob({ id: jobId });

        // show the notification
        this.showNotification({
          type: "info",
          id: uniqid("notification-msg-"),
          message: `Created ${folderAdded.name} successfully.`,
        });

        this.addJob({
          jobType: JobType.LIST_FILES,
          data: {
            path: jobData.path,
            treeId: "explorer-main",
          },
        });

        // refresh the explorer
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
          path
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

        this.addJob({
          jobType: JobType.LIST_FILES,
          data: {
            path: fileUploaded.path,
            treeId: "explorer-main",
          },
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
