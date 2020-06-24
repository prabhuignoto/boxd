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
          type: "failure",
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
    result({ data: { batchWorkFailed } }) {
      const jobType = batchWorkFailed.job_type;
      // const status = batchWorkFailed.status;
      const uiJobId = batchWorkFailed.ui_job_id;

      this.unLockItems({ jobId: uiJobId, failed: true });
      this.failedJob({ id: uiJobId });

      this.showNotification({
        type: "failure",
        id: uniqid("notification-msg-"),
        message: `The ${jobType} job failed.`,
      });
    },
  },
  folder_added: {
    query: gql`
      subscription {
        folderAdded {
          success
          name
          ui_job_id
        }
      }
    `,
    result({ data: { folderAdded } }) {
      if (folderAdded.success) {
        this.completeJob({ id: folderAdded.ui_job_id });
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
        this.failedJob({ id: folderAdded.ui_job_id });
        this.showNotification({
          type: "failure",
          id: uniqid("notification-msg-"),
          message: `Failed to create the folder ${folderAdded.name}.`,
        });
      }
    },
  },
  upload_completed: {
    query: gql`
      subscription {
        fileUploaded {
          success
          fileName
          ui_job_id
        }
      }
    `,
    result({ data: { fileUploaded } }) {
      if (fileUploaded.success) {
        this.completeJob({ id: fileUploaded.ui_job_id });

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
        this.failedJob({ id: fileUploaded.ui_job_id });

        this.showNotification({
          type: "failure",
          id: uniqid("notification-msg-"),
          message: `Could not upload ${fileUploaded.fileName}.`,
        });
      }
    },
  },
};
