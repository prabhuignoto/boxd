export default {
  state: {
    createFolder: {
      selection: null,
      hideExplorer: false,
    },
    deleteFolder: {
      path: "",
    },
  },
  mutations: {
    createFolderSelection(state, { path }) {
      state.createFolder.selection = path;
    },
    deleteFolder(state, { path }) {
      state.deleteFolder.path = path;
    },
    hideCreateFolderExplorer(state, { status }) {
      state.createFolder.hideExplorer = status;
    },
  },
  actions: {
    createFolderSelection({ commit }, path) {
      commit({
        type: "createFolderSelection",
        path,
      });
    },
    deleteFolder({ commit }, path) {
      commit({
        type: "deleteFolder",
        path,
      });
    },
    hideCreateFolderExplorer({ commit }, status) {
      commit({
        type: "hideCreateFolderExplorer",
        status,
      });
    },
  },
  getters: {
    deletePath: state => state.deleteFolder.path,
    isCreateFolderExpHidden: state => state.createFolder.hideExplorer,
    getFolderSelectionFormatted: state =>
      state.createFolder.selection &&
      state.createFolder.selection.split("/").join(" / "),
    getFolderSelection: state => state.createFolder.selection,
  },
};
