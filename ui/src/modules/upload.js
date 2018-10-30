export default {
  state: {
    uploadPath: "",
    enableUploadExplorer: true
  },
  mutations: {
    uploadFile(state, { path }) {
      state.uploadPath = path;
    },
    updateUploadExplorerStatus(state, { status }) {
      state.enableUploadExplorer = status;
    }
  },
  actions: {
    uploadFile({ commit }, path) {
      commit({
        type: "uploadFile",
        path
      });
    },
    updateUploadExplorerStatus({ commit }, status) {
      commit({
        type: "updateUploadExplorerStatus",
        status
      });
    }
  },
  getters: {
    getUploadPath: state => state.uploadPath,
    getUploadExplorerStatus: state => state.enableUploadExplorer
  }
};
