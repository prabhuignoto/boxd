import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "../store";

interface UploadState {
  uploadPath: string;
  enableUploadExplorer: boolean;
}

const mutations: MutationTree<UploadState> = {
  uploadFile(state, { path }) {
    state.uploadPath = path;
  },
  updateUploadExplorerStatus(state, { status }) {
    state.enableUploadExplorer = status;
  },
};

const actions: ActionTree<UploadState, RootState> = {
  uploadFile({ commit }, path) {
    commit({
      type: "uploadFile",
      path,
    });
  },
  updateUploadExplorerStatus({ commit }, status) {
    commit({
      type: "updateUploadExplorerStatus",
      status,
    });
  },
};

const getters: GetterTree<UploadState, RootState> = {
  getUploadPath: state => state.uploadPath,
  getUploadExplorerStatus: state => state.enableUploadExplorer,
  getUploadPathFormatted: state =>
    state.uploadPath && state.uploadPath.split("/").join(" / "),
};

export default {
  state: {
    enableUploadExplorer: true,
    uploadPath: "",
  },
  mutations,
  actions,
} as Module<UploadState, RootState>;

// export default {
//   state: {
//     uploadPath: "",
//     enableUploadExplorer: true,
//   },
//   mutations: {
//     uploadFile(state, { path }) {
//       state.uploadPath = path;
//     },
//     updateUploadExplorerStatus(state, { status }) {
//       state.enableUploadExplorer = status;
//     },
//   },
//   actions: {
//     uploadFile({ commit }, path) {
//       commit({
//         type: "uploadFile",
//         path,
//       });
//     },
//     updateUploadExplorerStatus({ commit }, status) {
//       commit({
//         type: "updateUploadExplorerStatus",
//         status,
//       });
//     },
//   },
//   getters: {
//     getUploadPath: state => state.uploadPath,
//     getUploadExplorerStatus: state => state.enableUploadExplorer,
//     getUploadPathFormatted: state =>
//       state.uploadPath && state.uploadPath.split("/").join(" / "),
//   },
// };
