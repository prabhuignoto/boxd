export default {
  state: {
    fileStatus: "closed",
    activeFileName: "",
    activeFilePath: "",
    activeFileSize: "",
    activeFileModified: ""
  },
  mutations: {
    updateFileName(state, { name }) {
      state.activeFileName = name;
    },
    updateFilePath(state, { path }) {
      state.activeFilePath = path;
    },
    updateFileSize(state, { size }) {
      state.activeFileSize = size;
    },
    updateFileModified(state, { modified }) {
      state.activeFileModified = modified;
    },
    updateFileStatus(state, { status }) {
      state.fileStatus = status;
    }
  },
  actions: {
    updateFileName({ commit }, name) {
      commit({
        type: "updateFileName",
        name
      });
    },
    updateFilePath({ commit }, path) {
      commit({
        type: "updateFilePath",
        path
      });
    },
    updateFileStatus({ commit }, status) {
      commit({
        type: "updateFileStatus",
        status
      });
    },
    updateFileModified({ commit }, modified) {
      commit({
        type: "updateFileModified",
        modified
      });
    },
    updateFileSize({ commit }, size) {
      commit({
        type: "updateFileSize",
        size
      });
    }
  },
  getters: {
    getFileStatus: state => state.fileStatus,
    getActiveFileName: state => state.activeFileName,
    getActiveFileSize: state => state.activeFileSize,
    getActiveFileModified: state => state.activeFileModified
  }
};
