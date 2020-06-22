import _ from "lodash";

export default {
  state: {
    items: {},
  },
  mutations: {
    addJob(state, { jobId, jobType }) {
      state.items[jobId] = {
        jobId,
        jobType,
        running: false,
        startTime: null,
        endTime: null,
        data: null,
      };
    },
    removeJob(state, { jobId }) {
      if (jobId in state.items) {
        delete state.items[jobId];
      }
    },
    startJob(state, { jobId }) {
      if (jobId in state.items) {
        state.items[jobId].running = true;
        state.items[jobId].startTime = Date.now();
      }
    },
    completeJob(state, { jobId, jobData }) {
      if (jobId in state.items) {
        state.items[jobId].running = false;
        state.items[jobId].endTime = Date.now();
        state.items[jobId].status = "completed";
        state.items[jobId].data = jobData;
      }
    },
  },
  actions: {
    addJob({ commit }, jobId, jobType) {
      commit({
        type: "addJob",
        jobId,
        jobType,
      });
    },
    removeJob({ commit }, jobId) {
      commit({
        type: "removeJob",
        jobId,
      });
    },
    startJob({ commit }, jobId) {
      commit({
        type: "startJob",
        jobId,
      });
    },
    completeJob({ commit }, jobId, jobData) {
      commit({
        type: "startJob",
        jobId,
        jobData,
      });
    },
  },
  getters: {
    getJobById: state => id => state.items[id],
    getAllJobs: state => state.items,
    getAllRunningJobs: state => _.filter(state.items, item => item.running),
    getAllCompletedJobs: state =>
      _.filter(state.items, item => item.status === "completed"),
    getAllNewJobs: state =>
      _.filter(state.items, item => !item.startTime && !item.running),
  },
};
