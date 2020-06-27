import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

interface TreeState {
  refetch: boolean;
  tree: {
    created_at: number;
    last_updated: number;
    data: any;
  };
}

const actions: ActionTree<TreeState, RootState> = {
  createTree({ commit }, { entries }) {
    commit({
      type: "createTree",
      entries,
    });
  },
  deleteTree({ commit }) {
    commit({
      type: "deleteTree",
    });
  },
  repopulateTree({ commit }, path) {
    commit({
      type: "repopulateTree",
      path,
    });
  },
  repopulateTreeComplete({ commit }) {
    commit({
      type: "repopulateTreeComplete",
    });
  },
};

const mutations: MutationTree<TreeState> = {
  createTree(state, { data }) {
    state.tree = {
      created_at: Date.now(),
      last_updated: 0,
      data,
    };
  },
  deleteTree(state) {
    state.tree = {
      created_at: 0,
      last_updated: 0,
      data: {},
    };
  },
  repopulateTree(state) {
    state.refetch = true;
  },
  repopulateTreeComplete(state) {
    state.refetch = false;
  },
};

const getters: GetterTree<TreeState, RootState> = {
  getRefetchTreeStatus: state => state.refetch,
};

export default {
  state: {
    refetch: false,
    tree: {
      created_at: 0,
      last_updated: 0,
      data: {},
    },
  },
  mutations,
  actions,
  getters,
} as Module<TreeState, RootState>;
