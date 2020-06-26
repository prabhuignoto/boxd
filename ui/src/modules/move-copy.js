export default {
  state: {
    moveResource: {
      src: "",
      dest: "",
    },
    copyResource: {
      src: "",
      dest: "",
    },
    mode: null,
    skipToFinal: false,
    bulkModeEnabled: false,
    moveResourceBulk: [],
    copyResourceBulk: [],
  },
  mutations: {
    moveResxSource(state, { path }) {
      state.moveResource = Object.assign({}, state.moveResource, {
        src: path,
      });
    },
    moveResxDest(state, { path }) {
      state.moveResource = Object.assign({}, state.moveResource, {
        dest: path,
      });
    },
    copyResxSource(state, { path }) {
      state.copyResource = Object.assign({}, state.copyResource, {
        src: path,
      });
    },
    copyResxDest(state, { path }) {
      state.copyResource = Object.assign({}, state.copyResource, {
        dest: path,
      });
    },
    clearMoveResx(state) {
      state.moveResource.src = "";
      state.moveResource.dest = "";
    },
    clearCopyResx(state) {
      state.copyResource = null;
    },
    clearMoveCopyState(state) {
      state.moveResource = null;
      state.copyResource = null;
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
          to_path: `${path}${item.from_path}`,
        })
      );
    },
    setCopyResxBulk(state, { config }) {
      state.copyResourceBulk = config;
    },
    updateDestForCopyResxBulk(state, { path }) {
      state.copyResourceBulk = state.copyResourceBulk.map(item =>
        Object.assign({}, item, {
          to_path: `${path}${item.from_path}`,
        })
      );
    },
    skipToFinal(state, { status }) {
      state.skipToFinal = status;
    },
  },
  actions: {
    moveResxSource({ commit }, path) {
      commit({
        type: "moveResxSource",
        path,
      });
    },
    moveResxDest({ commit }, path) {
      commit({
        type: "moveResxDest",
        path,
      });
    },
    copyResxSource({ commit }, path) {
      commit({
        type: "copyResxSource",
        path,
      });
    },
    copyResxDest({ commit }, path) {
      commit({
        type: "copyResxDest",
        path,
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
  },
  getters: {
    moveResxSrc: state => {
      return state.moveResource && state.moveResource.src;
    },
    moveResxDest: state => state.moveResource && state.moveResource.dest,
    copyResxSrc: state => state.copyResource && state.copyResource.src,
    copyResxDest: state => state.copyResource && state.copyResource.dest,
    getMoveCopyMode: state => state.mode,
    getSkipToFinal: state => state.skipToFinal,
    getBulkMode: state => state.bulkModeEnabled,
    moveResxSrcFormatted: state =>
      state.moveResource &&
      state.moveResource.src &&
      state.moveResource.src.split("/").join(" / "),
    copyResxSrcFormatted: state =>
      state.copyResource &&
      state.copyResource.src &&
      state.copyResource.src.split("/").join(" / "),
    moveResxDestFormatted: state =>
      state.moveResource &&
      state.moveResource.dest &&
      state.moveResource.dest.split("/").join(" / "),
    copyResxDestFormatted: state =>
      state.copyResource &&
      state.copyResource.dest &&
      state.copyResource.dest.split("/").join(" / "),
    getMoveResourceBulk: state => state.moveResourceBulk,
    getCopyResourceBulk: state => state.copyResourceBulk,
  },
};
