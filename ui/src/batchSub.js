import gql from "graphql-tag";
import uniqid from "uniqid";

export default {
  dropbox_batch_work_complete: {
    query: gql`
      subscription {
        batchWorkComplete {
          job_id
          status
          entries {
            metadata {
              name
              path_lower
              content_hash
            }
          }
        }
      }
    `,
    result({ data: { batchWorkComplete } }) {
      this.markBulkCompletion("delete");
      this.removeItemsFromList(
        batchWorkComplete.entries.map(entry => entry.metadata.path_lower)
      );

      this.showNotification({
        type: "info",
        id: uniqid("notification-msg-"),
        message: `Files deleted successfully`,
      });
    },
  },
  dropbox_batch_work_running: {
    query: gql`
      subscription {
        batchWorkRunning {
          job_id
          status
          entries {
            metadata {
              name
              path_lower
              content_hash
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
          entries {
            metadata {
              name
              path_lower
              content_hash
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
