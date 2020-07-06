/* eslint-disable @typescript-eslint/no-unused-vars */
import gql from "graphql-tag";
import _ from "lodash";
import uniqid from "uniqid";
import { JobType } from "./modules/jobs";
import { SubscriptionProperty } from "./subModels";

export default {
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
} as SubscriptionProperty;
