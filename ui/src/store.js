import Vue from "vue";
import Vuex from "vuex";
import MoveCopy from "./modules/move-copy";
import Upload from "./modules/upload";
import Folder from "./modules/folder";
import File from "./modules/file";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    mvCopy: MoveCopy,
    folder: Folder,
    upload: Upload,
    file: File
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
      title: ""
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
    updateModalState(state, { status, componentToRender, title }) {
      state.modal.isActive = status;
      state.modal.componentToRender = componentToRender;
      state.modal.title = title;
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
    updateModalState({ commit }, { status, componentToRender, title }) {
      commit({
        type: "updateModalState",
        status,
        componentToRender,
        title
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
    getExplorerPath: state => state.explorer.path
  }
});
