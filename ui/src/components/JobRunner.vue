<script lang="ts">
import Vue, { VNode, CreateElement } from "vue";
import DeleteBulkGQL from "../graphql/deleteBulk";
import MoveBulkGQL from "../graphql/moveBulk";
import CopyBulkGQL from "../graphql/copyBulk";
import CreateFolderGQL from "../graphql/createFolder";
import BatchSub from "../batchSub";
import Axios from "axios";
import { Job, JobType } from "../modules/jobs";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

interface Methods {
  repopulateTree(): void;
  runDeleteJob(j: Job): void;
  runMoveJob(j: Job): void;
  runCopyJob(j: Job): void;
  runUploadJob(j: Job): void;
  runCreateFolder(j: Job): void;
}

@Component({
  name: "JobRunner",
  apollo: {
    $subscribe: BatchSub,
  },
})
export default class extends Vue {
  @Action("startJob") startJob;
  @Action("completeJob") completeJob;
  @Action("failedJob") failedJob;
  @Action("updateJob") updateJob;
  @Action("showNotification") showNotification;
  @Action("lockItems") lockItems;
  @Action("unLockItems") unLockItems;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("refetchData") refetchData;
  @Action("repopulateTree") repopulateTree;

  @Getter("getExplorerPath") getExplorerPath;
  @Getter("getJobDataById") getJobDataById;

  mounted() {
    this.$store.watch(
      (state, getters) => getters.getAllNewJobs,
      jobs => {
        jobs.forEach(job => {
          this.startJob(job.id);
          if (job.jobType === JobType.DELETE) {
            this.runDeleteJob(job);
          } else if (job.jobType === JobType.MOVE) {
            this.runMoveJob(job);
          } else if (job.jobType === JobType.COPY) {
            this.runCopyJob(job);
          } else if (job.jobType === JobType.CREATE_FOLDER) {
            this.runCreateFolder(job);
          } else if (job.jobType === JobType.UPLOAD) {
            this.runUploadJob(job);
          }
        });
      }
    );
  }

  render(h: CreateElement): VNode {
    return h("div");
  }

  async runDeleteJob(job) {
    const items = job.data && job.data.items;
    try {
      if (items) {
        this.lockItems({
          items: items.map(item => item.id),
          lockType: "DELETE",
          jobId: job.id,
        });
        await this.$apollo.mutate({
          mutation: DeleteBulkGQL,
          variables: {
            options: {
              paths: items.map(item => item.pathLower),
              uiJobId: job.id,
            },
          },
        });
      }
    } catch (error) {
      items && this.unLockItems({ items: items.map(item => item.id) });
      this.failedJob({
        id: job.id,
        reason: error,
      });
    }
  }

  async runMoveJob(job) {
    const items = job.data && job.data.items;
    try {
      if (items) {
        this.lockItems({
          items: items.map(item => item.id),
          lockType: "MOVE",
          jobId: job.id,
        });
        await this.$apollo.mutate({
          mutation: MoveBulkGQL,
          variables: {
            options: {
              entries: items,
              autorename: true,
              uiJobId: job.id,
            },
          },
        });
      }
    } catch (error) {
      items && this.unLockItems({ jobId: job.id });
      this.failedJob({
        id: job.id,
        reason: error,
      });
    }
  }

  async runCopyJob(job) {
    const items = job.data && job.data.items;
    try {
      if (items) {
        this.lockItems({
          items: items.map(item => item.id),
          lockType: "COPY",
          jobId: job.id,
        });
        await this.$apollo.mutate({
          mutation: CopyBulkGQL,
          variables: {
            options: {
              entries: items,
              autorename: true,
              uiJobId: job.id,
            },
          },
        });
      }
    } catch (error) {
      items && this.unLockItems({ items: items.map(item => item.id) });
      this.failedJob({
        id: job.id,
        reason: error,
      });
    }
  }

  async runCreateFolder(job) {
    const { path, name } = job.data;
    try {
      await this.$apollo.mutate({
        mutation: CreateFolderGQL,
        variables: {
          path: path,
          name: name,
          uiJobId: job.id,
        },
      });
    } catch (error) {
      this.failedJob({
        id: job.id,
        reason: error,
      });
    }
  }

  async runUploadJob(job) {
    const { formData } = job.data;
    formData.append("uiJobId", job.id);
    try {
      await Axios.post(`${process.env.VUE_APP_API_SERVER}/upload`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progressEvent => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          this.updateJob({
            id: job.id,
            data: {
              progress,
            },
          });
        },
      });
    } catch (error) {
      this.failedJob({
        id: job.id,
        reason: error,
      });
    }
  }
}
</script>
