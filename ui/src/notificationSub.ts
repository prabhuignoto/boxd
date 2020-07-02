import gql from "graphql-tag";
import uniqid from "uniqid";
import { DocumentNode } from "graphql";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SocketDataResponse, Notification, SocketResponse } from "./subModels";

interface NotificationSub {
  resxDeleted: {
    query: DocumentNode;
    result({ data: { resxDeleted: SocketResponse } }: SocketDataResponse): void;
    showNotification(n: Notification): void;
  };
  resxCopied: {
    query: DocumentNode;
    result({ data: { resxCopied: SocketResponse } }: SocketDataResponse): void;
    showNotification(n: Notification): void;
  };
  resxMoved: {
    query: DocumentNode;
    result({ data: { resxMoved: SocketResponse } }: SocketDataResponse): void;
    showNotification(n: Notification): void;
    refreshFileExplorer(n: { status: boolean; path: string }): void;
    getExplorerPath: string;
  };
}

export default {
  resxDeleted: {
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
        this.showNotification({
          type: "info",
          notificationTitle: "Deleted resource",
          id: uniqid("notification-msg-"),
          message: `Deleted ${resxDeleted.name.split("/").pop()} successfully.`,
        });
      } else {
        this.showNotification({
          type: "Error",
          notificationTitle: "Failure",
          id: uniqid("notification-msg-"),
          message: `Unable to delete ${resxDeleted.name
            .split("/")
            .pop()} at the moment.`,
        });
      }
    },
  },
  resxCopied: {
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
        this.showNotification({
          type: "info",
          notificationTitle: "Copy resource",
          id: uniqid("notification-msg-"),
          message: `Copied ${resxCopied.name.split("/").pop()} successfully.`,
        });
      } else {
        this.showNotification({
          type: "Error",
          notificationTitle: "Failure",
          id: uniqid("notification-msg-"),
          message: `Unable to copy ${resxCopied.name.split("/").pop()}.`,
        });
      }
    },
  },
  resxMoved: {
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
        this.showNotification({
          type: "info",
          notificationTitle: "Move resource",
          id: uniqid("notification-msg-"),
          message: `Moved ${resxMoved.name.split("/").pop()} successfully.`,
        });
        this.refreshFileExplorer({
          status: true,
          path: this.getExplorerPath,
        });
      } else {
        this.showNotification({
          type: "Error",
          notificationTitle: "Failure",
          id: uniqid("notification-msg-"),
          message: `Unable to move ${resxMoved.name.split("/").pop()}.`,
        });
      }
    },
  },
} as NotificationSub;
