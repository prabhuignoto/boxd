export default {
  state: {
    uploadPath: ""
  },
  mutations: {
    uploadFile(state, { path }) {
      this.state.upload.uploadPath = path;
    }
  },
  actions: {
    uploadFile({ commit }, path) {
      commit({
        type: "uploadFile",
        path
      });
    }
  },
  getters: {
    getUploadPath: state => state.uploadPath
  }
};
