import _ from "lodash";
import uniqid from "uniqid";
import Vue from "vue";
import { MutationTree, ActionTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

export enum JobType {
  CREATE_FOLDER = "CREATE_FOLDER",
  UPLOAD = "UPLOAD",
  MOVE = "MOVE",
  COPY = "COPY",
  DELETE = "DELETE",
}

export interface JobData {
  items?: {
    id: string;
    path_lower?: string;
  }[];
  formData?: FormData;
  path?: string;
  name?: string;
}

export interface Job {
  id: string;
  jobType: JobType;
  running: boolean;
  startTime: number;
  endTime: number;
  data: JobData;
  status: string;
  reason: string;
}

interface JobState {
  jobs: {
    [key: string]: Job;
  };
}

const mutations: MutationTree<JobState> = {
  addJob(state, { jobType, data }) {
    const id = uniqid();
    Vue.set(state.jobs, id, {
      id: id,
      jobType,
      running: false,
      startTime: null,
      endTime: null,
      data,
      status: "not started",
      reason: "",
    });
  },
  removeJob(state, { id }) {
    if (id in state.jobs) {
      Vue.delete(state.jobs, id);
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
      item.data = {};
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
  updateJob(state, { id, data }) {
    if (id in state.jobs) {
      const item = state.jobs[id];
      Vue.set(item, "data", Object.assign({}, state.jobs[id].data, data));
    }
  },
  clearAllJobs(state) {
    state.jobs = {};
  },
};

const actions: ActionTree<JobState, RootState> = {
  addJob({ commit, rootState }, { jobType, data }) {
    console.log(rootState);
    debugger;
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
  updateJob({ commit }, { id, data }) {
    commit({
      type: "updateJob",
      data,
      id,
    });
  },
  clearAllJobs({ commit }) {
    commit({
      type: "clearAllJobs",
    });
  },
};

const getters: GetterTree<JobState, RootState> = {
  getJobById: state => (id: string) => state.jobs[id],
  getJobDataById: state => (id: string) => {
    return state.jobs[id].data;
  },
  getAllJobs: state => state.jobs,
  getAllRunningJobs: state => _.filter(state.jobs, item => item.running),
  getAllCompletedJobs: state =>
    _.filter(state.jobs, item => item.status === "completed"),
  getAllNewJobs: state => {
    return Object.keys(state.jobs)
      .filter(key => {
        const item = state.jobs[key];
        return !item.running && !item.startTime;
      })
      .map(id => state.jobs[id]);
  },
  getJobsEmpty: state => Object.keys(state.jobs).length < 1,
  getJobsActive: state => _.filter(state.jobs, item => item.running).length > 0,
};

export default {
  state: {
    jobs: {},
  },
  mutations,
  actions,
  getters,
} as Module<JobState, RootState>;
