import gql from "graphql-tag";
import uniqid from "uniqid";

export default {
  upload_completed: {
    query: gql`
      subscription {
        fileUploaded {
          success
          fileName
        }
      }
    `,
    result({ data: { fileUploaded } }) {
      if (fileUploaded.success) {
        this.notificationType = "Informational";
        this.notificationTitle = "Upload complete";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Uploaded ${fileUploaded.fileName} successfully.`,
        });
      } else {
        this.notificationType = "Error";
        this.notificationTitle = "Upload Failed";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Could not upload ${fileUploaded.fileName}.`,
        });
      }
    },
  },
  resx_deleted: {
    query: gql`
      subscription {
        resxDeleted {
          success
          name
        }
      }
    `,
    result({ data: { resxDeleted } }) {
      if (resxDeleted.success) {
        this.notificationType = "Informational";
        this.notificationTitle = "Deleted resource";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Deleted ${resxDeleted.name.split("/").pop()} successfully.`,
        });
      } else {
        this.notificationType = "Error";
        this.notificationTitle = "Failure";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Unable to delete ${resxDeleted.name
            .split("/")
            .pop()} at the moment.`,
        });
      }
    },
  },
  resx_copied: {
    query: gql`
      subscription {
        resxCopied {
          success
          name
        }
      }
    `,
    result({ data: { resxCopied } }) {
      if (resxCopied.success) {
        this.notificationType = "Informational";
        this.notificationTitle = "Copy resource";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Copied ${resxCopied.name.split("/").pop()} successfully.`,
        });
      } else {
        this.notificationType = "Error";
        this.notificationTitle = "Failure";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Unable to copy ${resxCopied.name.split("/").pop()}.`,
        });
      }
    },
  },
  resx_moved: {
    query: gql`
      subscription {
        resxMoved {
          success
          name
        }
      }
    `,
    result({ data: { resxMoved } }) {
      if (resxMoved.success) {
        this.notificationType = "Informational";
        this.notificationTitle = "Move resource";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Moved ${resxMoved.name.split("/").pop()} successfully.`,
        });
      } else {
        this.notificationType = "Error";
        this.notificationTitle = "Failure";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Unable to move ${resxMoved.name.split("/").pop()}.`,
        });
      }
    },
  },
  folder_added: {
    query: gql`
      subscription {
        folderAdded {
          success
          name
        }
      }
    `,
    result({ data: { folderAdded } }) {
      if (folderAdded.success) {
        this.notificationType = "Informational";
        this.notificationTitle = "Folder Added";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Added ${folderAdded.name.split("/").pop()} successfully.`,
        });
      } else {
        this.notificationType = "Error";
        this.notificationTitle = "Failure";
        this.addMessage({
          id: uniqid("notification-msg-"),
          message: `Failed to create the folder ${folderAdded.name
            .split("/")
            .pop()}.`,
        });
      }
    },
  },
};
