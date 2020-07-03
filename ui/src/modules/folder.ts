import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

interface FolderState {
  createFolder: {
    selection: string;
    hideExplorer: boolean;
  };
  deleteFolder: {
    path: string;
  };
}

const actions: ActionTree<FolderState, RootState> = {
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
};

const mutations: MutationTree<FolderState> = {
  createFolderSelection(state, { path }) {
    state.createFolder.selection = path;
  },
  deleteFolder(state, { path }) {
    state.deleteFolder.path = path;
  },
  hideCreateFolderExplorer(state, { status }) {
    state.createFolder.hideExplorer = status;
  },
};

const getters: GetterTree<FolderState, RootState> = {
  deletePath: state => state.deleteFolder.path,
  isCreateFolderExpHidden: state => state.createFolder.hideExplorer,
  getFolderSelectionFormatted: state =>
    state.createFolder.selection &&
    state.createFolder.selection.split("/").join(" / "),
  getFolderSelection: state => {
    const selection = state.createFolder.selection;
    return selection === "/" ? "" : selection;
  },
};

export default {
  state: {
    createFolder: {
      selection: "",
      hideExplorer: false,
    },
    deleteFolder: {
      path: "",
    },
  },
  mutations,
  actions,
  getters,
} as Module<FolderState, RootState>;
