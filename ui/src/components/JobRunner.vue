<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import DeleteBulkGQL from "../graphql/deleteBulk.gql";
import MoveBulkGQL from "../graphql/moveBulk.gql";
import CopyBulkGQL from "../graphql/copyBulk.gql";
import CreateFolderGQL from "../graphql/createFolder.gql";
import gql from "graphql-tag";
import BatchSub from "../batchSub";
import Axios from "axios";

export default Vue.extend({
  name: "JobRunner",
  mounted() {
    this.$store.watch(
      (state, getters) => getters.getAllNewJobs,
      jobs => {
        jobs.forEach(job => {
          this.startJob(job.id);
          if (job.jobType === "DELETE") {
            this.runDeleteJob(job);
          } else if (job.jobType === "MOVE") {
            this.runMoveJob(job);
          } else if (job.jobType === "COPY") {
            this.runCopyJob(job);
          } else if (job.jobType === "CREATE_FOLDER") {
            this.runCreateFolder(job);
          } else if (job.jobType === "UPLOAD") {
            this.runUploadJob(job);
          }
        });
      }
    );
  },
  methods: {
    ...mapActions([
      "startJob",
      "completeJob",
      "failedJob",
      "updateJob",
      "showNotification",
      "lockItems",
      "unLockItems",
      "refreshFileExplorer",
      "refetchData",
      "refreshFileExplorer",
    ]),
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
            mutation: gql(DeleteBulkGQL),
            variables: {
              options: {
                paths: items.map(item => item.path_lower),
                ui_job_id: job.id,
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
    },
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
            mutation: gql(MoveBulkGQL),
            variables: {
              options: {
                entries: items,
                autorename: true,
                ui_job_id: job.id,
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
    },
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
            mutation: gql(CopyBulkGQL),
            variables: {
              options: {
                entries: items,
                autorename: true,
                ui_job_id: job.id,
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
    },
    async runCreateFolder(job) {
      const { path, name } = job.data;
      try {
        await this.$apollo.mutate({
          mutation: gql(CreateFolderGQL),
          variables: {
            path: path,
            name: name,
            ui_job_id: job.id,
          },
        });
      } catch (error) {
        this.failedJob({
          id: job.id,
          reason: error,
        });
      }
    },
    async runUploadJob(job) {
      const { formData } = job.data;
      debugger;
      formData.append("ui_job_id", job.id);
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
    },
  },
  computed: {
    ...mapGetters(["getExplorerPath", "getJobDataById"]),
  },
  render: () => null,
  apollo: {
    $subscribe: BatchSub,
  },
});
</script>
