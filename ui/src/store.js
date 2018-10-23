import Vue from "vue";
import Vuex from "vuex";
import MoveCopy from "./modules/move-copy";
import Upload from "./modules/upload";
import Folder from "./modules/folder";
import File from "./modules/file";
import List from "./modules/list";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mvCopy: MoveCopy,
    folder: Folder,
    upload: Upload,
    file: File,
    list: List
  },
  state: {
    explorer: {
      path: ""
    },
    fileExplorer: {
      activeFileNode: {}
    },
    modal: {
      isActive: false,
      componentToRender: "",
      title: "",
      disableHeader: false
    },
    treeView: {
      data: []
    }
  },
  mutations: {
    updatePath(state, { path }) {
      state.explorer.path = path;
    },
    updateExplorerNode(state, { node }) {
      state.fileExplorer.activeFileNode = node;
    },
    updateModalState(
      state,
      { status, componentToRender, title, disableHeader }
    ) {
      state.modal.isActive = status;
      state.modal.componentToRender = componentToRender;
      state.modal.title = title;
      state.modal.disableHeader = disableHeader;
    },
    updateTreeViewData(state, { data }) {
      state.treeView.data = data.map(x =>
        Object.assign({}, x, {
          selected: false
        })
      );
    }
  },
  actions: {
    updatePath({ commit }, path) {
      commit({
        type: "updatePath",
        path
      });
    },
    updateExplorerNode({ commit }, node) {
      commit({
        type: "updateExplorerNode",
        node
      });
    },
    updateModalState(
      { commit },
      { status, componentToRender, title, disableHeader }
    ) {
      commit({
        type: "updateModalState",
        status,
        componentToRender,
        title,
        disableHeader
      });
    },
    updateTreeViewData({ commit }, data) {
      commit({
        type: "updateTreeViewData",
        data
      });
    }
  },
  getters: {
    isModalActive: state => state.modal.isActive,
    getPopupComponent: state => state.modal.componentToRender,
    getPopupTitle: state => state.modal.title,
    getIsDisableHeader: state => state.modal.disableHeader,
    getExplorerPath: state => state.explorer.path
  }
});
