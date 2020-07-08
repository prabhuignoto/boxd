import { RootState } from "@/store";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

const resxInitState = {
  src: {
    path: null,
    id: "",
  },
  dest: {
    path: null,
    id: "",
  },
};

interface resxState {
  src: {
    id: string;
    path: string | null;
  };
  dest: {
    id: string;
    path: string | null;
  };
}

interface MoveCopyState {
  moveResource: resxState;
  copyResource: resxState;
  mode: null;
  skipToFinal: boolean;
  bulkModeEnabled: boolean;
  moveResourceBulk: any[];
  copyResourceBulk: any[];
}

const actions: ActionTree<MoveCopyState, RootState> = {
  moveResxSource({ commit }, { path, id }) {
    commit({
      type: "moveResxSource",
      path,
      id,
    });
  },
  moveResxDest({ commit }, { path, id }) {
    commit({
      type: "moveResxDest",
      path,
      id,
    });
  },
  copyResxSource({ commit }, { path, id }) {
    commit({
      type: "copyResxSource",
      path,
      id,
    });
  },
  copyResxDest({ commit }, { path, id }) {
    commit({
      type: "copyResxDest",
      path,
      id,
    });
  },
  clearMoveResx({ commit }) {
    commit({
      type: "clearMoveResx",
    });
  },
  clearCopyResx({ commit }) {
    commit({
      type: "clearCopyResx",
    });
  },
  skipToFinal({ commit }, status) {
    commit({
      type: "skipToFinal",
      status,
    });
  },
  updateMoveCopyMode({ commit }, mode) {
    commit({
      type: "updateMoveCopyMode",
      mode,
    });
  },
  setMoveResxBulk({ commit }, config) {
    commit({
      type: "setMoveResxBulk",
      config,
    });
  },
  updateDestForMoveResxBulk({ commit }, path) {
    commit({
      type: "updateDestForMoveResxBulk",
      path,
    });
  },
  setCopyResxBulk({ commit }, config) {
    commit({
      type: "setCopyResxBulk",
      config,
    });
  },
  updateDestForCopyResxBulk({ commit }, path) {
    commit({
      type: "updateDestForCopyResxBulk",
      path,
    });
  },
  clearMoveCopyState({ commit }) {
    commit({
      type: "clearMoveCopyState",
    });
  },
  enableBulkMode({ commit }, enable) {
    commit({
      type: "enableBulkMode",
      enable,
    });
  },
};

const mutations: MutationTree<MoveCopyState> = {
  moveResxSource(state, { path, id }) {
    state.moveResource = Object.assign({}, state.moveResource, {
      src: {
        path: path === "/" ? "" : path,
        id,
      },
    });
  },
  moveResxDest(state, { path, id }) {
    state.moveResource = Object.assign({}, state.moveResource, {
      dest: {
        path: path === "/" ? "" : path,
        id,
      },
    });
  },
  copyResxSource(state, { path, id }) {
    state.copyResource = Object.assign({}, state.copyResource, {
      src: {
        path: path === "/" ? "" : path,
        id,
      },
    });
  },
  copyResxDest(state, { path, id }) {
    state.copyResource = Object.assign({}, state.copyResource, {
      dest: {
        path: path === "/" ? "" : path,
        id,
      },
    });
  },
  clearMoveResx(state) {
    state.moveResource.src = { path: null, id: "" };
    state.moveResource.dest = { path: null, id: "" };
  },
  clearCopyResx(state) {
    state.copyResource = {
      ...resxInitState,
    };
  },
  clearMoveCopyState(state) {
    state.moveResource = {
      ...resxInitState,
    };
    state.copyResource = {
      ...resxInitState,
    };
  },
  updateMoveCopyMode(state, { mode }) {
    state.mode = mode;
  },
  enableBulkMode(state, { enable }) {
    state.bulkModeEnabled = enable;
  },
  setMoveResxBulk(state, { config }) {
    state.moveResourceBulk = config;
  },
  updateDestForMoveResxBulk(state, { path }) {
    state.moveResourceBulk = state.moveResourceBulk.map(item =>
      Object.assign({}, item, {
        toPath: `${path}${item.fromPath}`,
      })
    );
  },
  setCopyResxBulk(state, { config }) {
    state.copyResourceBulk = config;
  },
  updateDestForCopyResxBulk(state, { path }) {
    state.copyResourceBulk = state.copyResourceBulk.map(item =>
      Object.assign({}, item, {
        toPath: `${path}${item.fromPath}`,
      })
    );
  },
  skipToFinal(state, { status }) {
    state.skipToFinal = status;
  },
};

const getters: GetterTree<MoveCopyState, RootState> = {
  moveResxSrc: state => {
    return state.moveResource && state.moveResource.src;
  },
  moveResxDest: state => state.moveResource && state.moveResource.dest,
  copyResxSrc: state => state.copyResource && state.copyResource.src,
  copyResxDest: state => state.copyResource && state.copyResource.dest,
  getMoveCopyMode: state => state.mode,
  getSkipToFinal: state => state.skipToFinal,
  getBulkMode: state => state.bulkModeEnabled,
  moveResxSrcFormatted: state => {
    const src = state.moveResource.src;
    if (src.path === "") {
      return "/";
    } else if (src) {
      return src.path && src.path.split("/").join(" / ");
    }
  },
  copyResxSrcFormatted: state => {
    const src = state.copyResource.src;
    if (src.path === "") {
      return "/";
    } else if (src) {
      return src.path && src.path.split("/").join(" / ");
    }
  },
  moveResxDestFormatted: state => {
    const dest = state.moveResource.dest;
    if (dest.path === "") {
      return "/";
    } else if (dest) {
      return dest.path && dest.path.split("/").join(" / ");
    }
  },
  copyResxDestFormatted: state => {
    const dest = state.copyResource.dest;
    if (dest.path === "") {
      return "/";
    } else if (dest) {
      return dest.path && dest.path.split("/").join(" / ");
    }
  },
  getMoveResourceBulk: state => state.moveResourceBulk,
  getCopyResourceBulk: state => state.copyResourceBulk,
};

export default {
  state: {
    moveResource: {
      ...resxInitState,
    },
    copyResource: {
      ...resxInitState,
    },
    mode: null,
    skipToFinal: false,
    bulkModeEnabled: false,
    moveResourceBulk: [],
    copyResourceBulk: [],
  },
  actions,
  mutations,
  getters,
} as Module<MoveCopyState, RootState>;
