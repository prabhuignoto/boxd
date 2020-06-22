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
      this.markBulkCompletion(batchWorkComplete.job_type);

      if (jobType === "move" || jobType == "delete") {
        this.removeItemsFromList(
          batchWorkComplete.entries.map(entry => entry.metadata.id)
        );
      }

      this.showNotification({
        type: "info",
        id: uniqid("notification-msg-"),
        message: `Files ${jobType}d successfully`,
      });
    },
  },
  dropbox_batch_work_running: {
    query: gql`
      subscription {
        batchWorkRunning {
          job_id
          status
          job_type
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
      this.markBulkCompletion("failed");
      this.showNotification({
        type: "failure",
        id: uniqid("notification-msg-"),
        message: `Files deleted successfully`,
      });
    },
  },
};
