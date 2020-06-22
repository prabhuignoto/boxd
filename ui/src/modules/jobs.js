import _ from "lodash";
import uniqid from "uniqid";
import Vue from "vue";

export default {
  state: {
    jobs: {},
  },
  mutations: {
    addJob(state, { jobType, data }) {
      const id = uniqid();
      Vue.set(state.jobs, id, {
        id: id,
        // type of job MOVE/COPY/DELETE
        jobType,
        running: false,
        startTime: null,
        endTime: null,
        data,
        records: data.records || [],
      });
    },
    removeJob(state, { id }) {
      if (id in state.jobs) {
        delete state.jobs[id];
      }
    },
    startJob(state, { id }) {
      if (id in state.jobs) {
        const item = state.jobs[id];
        item.running = true;
        item.startTime = Date.now();
        item.status = "running";
      }
    },
    completeJob(state, { id }) {
      if (id in state.jobs) {
        const item = state.jobs[id];
        item.running = false;
        item.endTime = Date.now();
        item.status = "completed";
      }
    },
    failedJob(state, { id, reason }) {
      if (id in state.jobs) {
        const item = state.jobs[id];
        item.running = false;
        item.endTime = Date.now();
        item.status = "failed";
        item.reason = reason;
      }
    },
  },
  actions: {
    addJob({ commit }, { jobType, data }) {
      commit({
        type: "addJob",
        jobType,
        data,
      });
    },
    removeJob({ commit }, id) {
      commit({
        type: "removeJob",
        id,
      });
    },
    startJob({ commit }, id) {
      commit({
        type: "startJob",
        id,
      });
    },
    completeJob({ commit }, { id }) {
      commit({
        type: "completeJob",
        id,
      });
    },
    failedJob({ commit }, { id, reason }) {
      commit({
        type: "failedJob",
        id,
        reason,
      });
    },
  },
  getters: {
    getJobById: state => id => state.jobs[id],
    getAllJobs: state => state.jobs,
    getAllRunningJobs: state => _.filter(state.jobs, item => item.running),
    getAllCompletedJobs: state => {
      return Object.keys(state.jobs)
        .filter(key => {
          const item = state.jobs[key];
          return item.status === "completed";
        })
        .map(id => state.jobs[id]);
    },
    getAllNewJobs: state => {
      return Object.keys(state.jobs)
        .filter(key => {
          const item = state.jobs[key];
          return !item.running && !item.startTime;
        })
        .map(id => state.jobs[id]);
    },
  },
};
