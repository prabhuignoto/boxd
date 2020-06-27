import { MutationTree, ActionTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

interface FileState {
  fileStatus: string;
  activeFileName: string;
  activeFilePath: string;
  activeFileSize: string;
  activeFileModified: string;
}

const mutations: MutationTree<FileState> = {
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
  },
};

const actions: ActionTree<FileState, RootState> = {
  updateFileName({ commit }, name) {
    commit({
      type: "updateFileName",
      name,
    });
  },
  updateFilePath({ commit }, path) {
    commit({
      type: "updateFilePath",
      path,
    });
  },
  updateFileStatus({ commit }, status) {
    commit({
      type: "updateFileStatus",
      status,
    });
  },
  updateFileModified({ commit }, modified) {
    commit({
      type: "updateFileModified",
      modified,
    });
  },
  updateFileSize({ commit }, size) {
    commit({
      type: "updateFileSize",
      size,
    });
  },
};

const getters: GetterTree<FileState, RootState> = {
  getFileStatus: state => state.fileStatus,
  getActiveFileName: state => state.activeFileName,
  getActiveFileSize: state => state.activeFileSize,
  getActiveFileModified: state => state.activeFileModified,
};

export default {
  state: {
    fileStatus: "closed",
    activeFileName: "",
    activeFilePath: "",
    activeFileSize: "",
    activeFileModified: "",
  },
  mutations,
  actions,
  getters,
} as Module<FileState, RootState>;
