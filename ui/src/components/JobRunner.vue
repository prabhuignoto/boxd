<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import DeleteBulkGQL from "../graphql/deleteBulk.gql";
import MoveBulkGQL from "../graphql/moveBulk.gql";
import CopyBulkGQL from "../graphql/copyBulk.gql";
import gql from "graphql-tag";
import BatchSub from "../batchSub";

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
      "showNotification",
      "lockItems",
      "unLockItems",
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
  },
  computed: {
    ...mapGetters(["getExplorerPath"]),
  },
  render: () => null,
  apollo: {
    $subscribe: BatchSub,
  },
});
</script>
