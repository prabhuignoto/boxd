import { MutationTree, ActionTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";
import { TreeNode, LockType } from "./models";
import _ from "lodash";
import Vue from "vue";

export interface BulkState {
  activeRecords: TreeNode[];
  bulkOps: {
    [key: string]: {
      lockType: LockType;
      items: TreeNode[];
    };
  };
}

const mutations: MutationTree<BulkState> = {
  addItemForBulk(state, { item }) {
    state.activeRecords = state.activeRecords.concat(item);
  },
  addItemsForBulk(state, { items }) {
    state.activeRecords = _.differenceWith(
      state.activeRecords,
      items,
      _.isEqual
    );
  },
  removeItemFromBulk(state, { item }) {
    state.activeRecords = _.filter(state.activeRecords, x => x.id !== item.id);
  },
  clearAllBulk(state) {
    state.activeRecords = [];
    state.bulkOps = {};
  },
  startBulkOps(state, { jobId, lockType }) {
    Vue.set(state.bulkOps, jobId, {
      lockType,
      items: [...state.activeRecords],
    });
    state.activeRecords = [];
  },
  stopBulkOps(state, { jobId }) {
    Vue.delete(state.bulkOps, jobId);
  },
};

const actions: ActionTree<BulkState, RootState> = {
  addItemForBulk({ commit }, { item }: { item: TreeNode }) {
    commit({
      type: "addItemForBulk",
      item,
    });
  },
  addItemsForBulk({ commit }, { items }: { items: TreeNode[] }) {
    commit({
      type: "addItemsForBulk",
      items,
    });
  },
  removeItemFromBulk({ commit }, { item }) {
    commit({
      type: "removeItemFromBulk",
      item,
    });
  },
  clearAllBulk({ commit }) {
    commit({
      type: "clearAllBulk",
    });
  },
  startBulkOps({ commit }, { jobId, lockType }) {
    commit({
      type: "startBulkOps",
      jobId,
      lockType,
    });
  },
  stopBulkOps({ commit }, { jobId }) {
    commit({
      type: "stopBulkOps",
      jobId,
    });
  },
};

const getters: GetterTree<BulkState, RootState> = {
  getActiveBulkRecords: state => state.activeRecords,
  getBulkOpByJobId: state => (jobId: string) => state.bulkOps[jobId],
  getAllTreeNodeItems: state =>
    _.chain(state.bulkOps)
      .flatMap(node => node.items)
      .uniqBy(x => x.id)
      .value(),
  getLockType: state => (id: string) => {
    const result = _.find(state.bulkOps, job =>
      job.items.some(item => item.id === id)
    );
    if (result) {
      return result.lockType;
    }
  },
};

export default {
  state: {
    activeRecords: [],
    bulkOps: {},
  },
  mutations,
  actions,
  getters,
} as Module<BulkState, RootState>;
