import gql from "graphql-tag";
import uniqid from "uniqid";

export default {
  dropbox_batch_work_complete: {
    query: gql`
      subscription {
        batchWorkComplete {
          job_id
          status
          job_type
          ui_job_id
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
      const uiJobId = batchWorkComplete.ui_job_id;
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
          type: "error",
          id: uniqid("notification-msg-"),
          message: `The ${jobType} successfully`,
        });
      }
    },
  },
  dropbox_batch_work_running: {
    query: gql`
      subscription {
        batchWorkRunning {
          job_id
          status
          job_type
          ui_job_id
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
  dropbox_batch_work_failed: {
    query: gql`
      subscription {
        batchWorkFailed {
          job_id
          status
          job_type
          ui_job_id
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
    // result({ data: { batchWorkFailed } }) {
    result() {
      this.showNotification({
        type: "failure",
        id: uniqid("notification-msg-"),
        message: `Files deleted successfully`,
      });
    },
  },
};
