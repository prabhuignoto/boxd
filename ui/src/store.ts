import Vue from "vue";
import Vuex from "vuex";
import File from "./modules/file";
import Folder from "./modules/folder";
import Bulk, { BulkState } from "./modules/bulk";
import MoveCopy from "./modules/move-copy";
import Notification from "./modules/notification";
import Upload from "./modules/upload";
import Jobs from "./modules/jobs";
import Tree from "./modules/tree";

Vue.use(Vuex);

export enum ExplorerViewMode {
  LIST = "list",
  FOLDER = "folder",
}

export interface RootState {
  explorer: {
    path: string;
    mode: ExplorerViewMode;
  };
  fileExplorer: {
    refresh: {
      status: boolean;
      path: string;
      lastRefreshed: number;
    };
  };
  modal: {
    isActive: boolean;
    componentToRender: string;
    title: string;
    disableHeader: boolean;
    disableCloseBtn: boolean;
    width: number;
    status: boolean;
  };
  workFlowOrigin: string;
  list: BulkState;
}

export default new Vuex.Store({
  modules: {
    mvCopy: MoveCopy,
    folder: Folder,
    upload: Upload,
    file: File,
    bulk: Bulk,
    notification: Notification,
    jobs: Jobs,
    tree: Tree,
  },
  state: {
    explorer: {
      path: "",
      mode: ExplorerViewMode.FOLDER,
    },
    fileExplorer: {
      refresh: {
        status: false,
        path: "",
        lastRefreshed: 0,
      },
    },
    modal: {
      isActive: false,
      componentToRender: "",
      title: "",
      disableHeader: false,
      disableCloseBtn: false,
      width: 450,
      status: false,
    },
    workFlowOrigin: "",
    list: {
      activeRecords: [],
      bulkOps: {},
    },
  },
  mutations: {
    updatePath(state, { path }) {
      state.explorer.path = path;
    },
    updateModalState(
      state,
      {
        status,
        componentToRender,
        title,
        disableHeader,
        disableCloseBtn,
        width,
      }
    ) {
      state.modal.isActive = status;
      state.modal.componentToRender = componentToRender;
      state.modal.title = title;
      state.modal.disableHeader = disableHeader;
      state.modal.disableCloseBtn = disableCloseBtn;
      state.modal.width = width;
    },
    updateModalTitle(state, { title }) {
      state.modal.title = title;
    },
    updateWorkflowOrigin(state, { origin }) {
      state.workFlowOrigin = origin;
    },
    refreshFileExplorer(state, { status, path }) {
      Vue.set(state.fileExplorer, "refresh", {
        status,
        path,
        lastRefreshed: Date.now(),
      });
    },
    closeModal(state) {
      state.modal = {
        isActive: false,
        componentToRender: "",
        title: "",
        disableHeader: false,
        disableCloseBtn: false,
        width: 450,
        status: false,
      };
    },
    updateExplorerMode(state, { mode }) {
      state.explorer.mode = mode;
    },
  },
  actions: {
    updatePath({ commit }, path) {
      commit({
        type: "updatePath",
        path,
      });
    },
    updateExplorerNode({ commit }, node) {
      commit({
        type: "updateExplorerNode",
        node,
      });
    },
    updateModalTitle({ commit }, title) {
      commit({
        type: "updateModalTitle",
        title,
      });
    },
    updateModalState(
      { commit },
      {
        status,
        componentToRender,
        title,
        disableHeader,
        disableCloseBtn,
        width,
      }
    ) {
      commit({
        type: "updateModalState",
        status,
        componentToRender,
        title,
        disableHeader,
        disableCloseBtn,
        width,
      });
    },
    updateTreeViewData({ commit }, data) {
      commit({
        type: "updateTreeViewData",
        data,
      });
    },
    updateWorkflowOrigin({ commit }, origin) {
      commit({
        type: "updateWorkflowOrigin",
        origin,
      });
    },
    refreshFileExplorer({ commit }, { status, path }) {
      commit({
        type: "refreshFileExplorer",
        status,
        path,
      });
    },
    closeModal({ commit }) {
      commit({
        type: "closeModal",
      });
    },
    updateExplorerMode({ commit }, mode) {
      commit({
        type: "updateExplorerMode",
        mode,
      });
    },
  },
  getters: {
    isModalActive: state => state.modal.isActive,
    getPopupComponent: state => state.modal.componentToRender,
    getPopupTitle: state => state.modal.title,
    getIsDisableHeader: state => state.modal.disableHeader,
    getExplorerPath: state => state.explorer.path,
    getExplorerMode: state => state.explorer.mode,
    getDisableCloseBtn: state => state.modal.disableCloseBtn,
    getWorkflowOrigin: state => state.workFlowOrigin,
    getRefreshFileExplorer: state => {
      return state.fileExplorer.refresh;
    },
    getModalWidth: state => state.modal.width,
  },
});
