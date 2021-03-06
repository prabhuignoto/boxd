import { RootState } from "@/store";
import _ from "lodash";
import uniqid from "uniqid";
import Vue from "vue";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

export enum JobType {
  CREATE_FOLDER = "CREATE_FOLDER",
  UPLOAD = "UPLOAD",
  MOVE = "MOVE",
  COPY = "COPY",
  DELETE = "DELETE",
  LIST_FILES = "LIST_FILES",
  DOWNLOAD = "DOWNLOAD",
}

export interface JobData {
  items?: {
    id: string;
    pathLower?: string;
  }[];
  formData?: FormData;
  path?: string;
  name?: string;
  treeId: string;
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
    debugger;
    Vue.set(state.jobs, id, {
      id: id,
      jobType,
      running: false,
      startTime: null,
      endTime: null,
      data,
      status: "not_started",
      reason: "",
    });
  },
  removeJob(state, { id }) {
    if (id in state.jobs) {
      Vue.delete(state.jobs, id);
    }
  },
  startJob(state, { id }) {
    debugger;
    if (id in state.jobs) {
      Vue.set(
        state.jobs,
        id,
        Object.assign({}, state.jobs[id], {
          running: true,
          startTime: Date.now(),
          status: "running",
        })
      );
    }
  },
  completeJob(state, { id }) {
    if (id in state.jobs) {
      Vue.set(
        state.jobs,
        id,
        Object.assign({}, state.jobs[id], {
          running: false,
          endTime: Date.now(),
          status: "completed",
          data: {},
        })
      );
    }
  },
  failedJob(state, { id, reason }) {
    if (id in state.jobs) {
      Vue.set(
        state.jobs,
        id,
        Object.assign({}, state.jobs[id], {
          running: false,
          endTime: Date.now(),
          status: "failed",
          reason,
        })
      );
    }
  },
  updateJob(state, { id, data }) {
    if (id in state.jobs) {
      const item = state.jobs[id];
      Vue.set(item, "data", Object.assign({}, state.jobs[id].data, data));
    }
  },
  clearJob(state, { id }) {
    const nJobs = _.filter(state.jobs, job => job.id !== id).reduce((a, b) => Object.assign({}, a, {
      [b.id]: b
    }), {});
    Vue.set(state, "jobs", nJobs);
  },
  clearAllJobs(state) {
    state.jobs = {};
  },
};

const actions: ActionTree<JobState, RootState> = {
  addJob({ commit, rootState }, { jobType, data }) {
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
  clearJob({ commit }, { id }) {
    commit({
      type: "clearJob",
      id
    })
  }
};

const getters: GetterTree<JobState, RootState> = {
  getJobById: state => (id: string) => state.jobs[id],
  getJobDataById: state => (id: string) => {
    return state.jobs[id].data;
  },
  getAllJobs: state =>
    _.filter(state.jobs, item => item.jobType !== JobType.LIST_FILES),
  getAllRunningJobs: state => _.filter(state.jobs, item => item.running),
  getAllCompletedJobs: state =>
    _.filter(state.jobs, item => item.status === "completed"),
  getAllNewJobs: state => {
    return Object.keys(state.jobs)
      .filter(key => {
        const item = state.jobs[key];
        return item.status === "not_started";
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
