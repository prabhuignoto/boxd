<script lang="ts">
import Vue, { CreateElement, VNode } from "vue";
import { Component } from "vue-property-decorator";
import Pusher from "pusher-js";
import { SocketResponse } from "../subModels";
import { Action, Getter } from "vuex-class";
import uniqid from "uniqid";
import { JobData } from "../modules/jobs";
import _ from "lodash";
import { Item, SocketDataResponse } from "../subModels";
import { DocumentNode } from "graphql";
import { JobType } from "../modules/jobs";

interface ChannelResponse {
  [key: string]: SocketResponse;
}

interface FilesChannelResponse {
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

@Component({
  name: "Pusher",
})
export default class extends Vue {
  @Action("showNotification") showNotification;
  @Action("removeChildrenNodes") removeChildrenNodes;
  @Action("stopBulkOps") stopBulkOps;
  @Action("completeJob") completeJob;
  @Action("failedJob") failedJob;
  @Action("deleteNodes") deleteNodes;
  @Action("addJob") addJob;

  @Getter("getJobDataById") getJobDataById;

  render(h: CreateElement): VNode {
    return h("div");
  }

  mounted(): void {
    const pusher = new Pusher("4087ad33c613d546dcf3", {
      cluster: "ap2",
    });

    pusher.connect();

    pusher.connection.bind("error", () => {
      console.log(`Failed to connect to Pusher`);
    });

    pusher.connection.bind("connected", () => {
      const bulkChannel = pusher.subscribe("channel-batch");
      const uploadChannel = pusher.subscribe("channel-upload");
      const filesChannel = pusher.subscribe("channel-files");

      bulkChannel.bind(
        "batchWorkComplete",
        ({ batchWorkComplete }: ChannelResponse) =>
          this.handleBulkChannel(batchWorkComplete)
      );

      bulkChannel.bind(
        "batchWorkFailed",
        ({ batchWorkFailed }: ChannelResponse) =>
          this.handleFailure(batchWorkFailed)
      );

      uploadChannel.bind(
        "uploadCompleted",
        ({ fileUploaded }: ChannelResponse) =>
          this.handleUploadChannel(fileUploaded)
      );

      filesChannel.bind("resxCopied", ({ resxCopied }: ChannelResponse) =>
        this.handleCopyFilesChannel(resxCopied)
      );

      filesChannel.bind("folderAdded", ({ folderAdded }: ChannelResponse) =>
        this.handleCreateFolderChannel(folderAdded)
      );

      filesChannel.bind("resxDeleted", ({ resxDeleted }: ChannelResponse) =>
        this.handleDeleteFilesChannel(resxDeleted)
      );

      filesChannel.bind("resxMoved", ({ resxMoved }: ChannelResponse) =>
        this.handleMoveFilesChannel(resxMoved)
      );
    });
  }

  private handleBulkChannel(batchWorkComplete: SocketResponse) {
    const jobType = batchWorkComplete.job_type;
    const status = batchWorkComplete.status;
    const uiJobId = batchWorkComplete.uiJobId;

    const getPath = (path: string) => path.split("/").slice(0, -1).join("/");

    const data: JobData = this.getJobDataById(uiJobId);
    const items = data.items as Item[];
    const item = _.first(items);

    if (item && jobType === "move") {
      const src = getPath(item.fromPath);
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
  }

  private handleFailure(batchWorkFailed: SocketResponse) {
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
  }

  private handleUploadChannel(fileUploaded: SocketResponse) {
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
  }

  private handleCopyFilesChannel(resxCopied: SocketResponse) {
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
  }

  private handleMoveFilesChannel(resxMoved: SocketResponse) {
    if (resxMoved.success) {
      this.showNotification({
        type: "info",
        notificationTitle: "Move resource",
        id: uniqid("notification-msg-"),
        message: `Moved ${resxMoved.name.split("/").pop()} successfully.`,
      });
    } else {
      this.showNotification({
        type: "Error",
        notificationTitle: "Failure",
        id: uniqid("notification-msg-"),
        message: `Unable to move ${resxMoved.name.split("/").pop()}.`,
      });
    }
  }

  private handleDeleteFilesChannel(resxDeleted: SocketResponse) {
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
  }

  private handleCreateFolderChannel(folderAdded: SocketResponse) {
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

      // refresh the explorer
      this.addJob({
        jobType: JobType.LIST_FILES,
        data: {
          path: jobData.path,
          treeId: "explorer-main",
        },
      });
    } else {
      // set the job to failed
      this.failedJob({ id: folderAdded.uiJobId });

      // display the failure notification
      this.showNotification({
        type: "failure",
        id: uniqid("notification-msg-"),
        message: `Failed to create the folder ${folderAdded.name}.`,
      });
    }
  }
}
</script>

<style lang="scss" scoped></style>
