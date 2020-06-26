export default {
  state: {
    refetch: false,
    tree: {
      created_at: 0,
      last_updated: 0,
      data: {},
    },
  },
  mutations: {
    createTree(state, { entries }) {
      state.tree = {
        created_at: Date.now(),
        last_updated: 0,
        entries,
      };
    },
    deleteTree(state) {
      state.tree = {};
    },
    repopulateTree(state, { path }) {
      state.refetch = true;
    },
    repopulateTreeComplete(state) {
      state.refetch = false;
    },
  },
  actions: {
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
  },
  getters: {
    getTree: state => id => state.tress[id],
    getRefetchTreeStatus: state => state.refetch,
  },
};
