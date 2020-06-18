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
    mode: "",
    skipToFinal: false,
  },
  mutations: {
    moveResxSource(state, { path }) {
      state.moveResource.src = path;
    },
    moveResxDest(state, { path }) {
      state.moveResource.dest = path;
    },
    copyResxSource(state, { path }) {
      state.copyResource.src = path;
    },
    copyResxDest(state, { path }) {
      state.copyResource.dest = path;
    },
    clearMoveResx(state) {
      state.moveResource.src = "";
      state.moveResource.dest = "";
    },
    clearCopyResx(state) {
      state.copyResource.src = "";
      state.copyResource.dest = "";
    },
    clearMoveCopyState(state) {
      state.moveResource.src = "";
      state.moveResource.dest = "";
      state.copyResource.src = "";
      state.copyResource.dest = "";
    },
    updateMoveCopyMode(state, { mode }) {
      state.mode = mode;
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
    clearMoveCopyState({ commit }) {
      commit({
        type: "clearMoveCopyState",
      });
    },
  },
  getters: {
    moveResxSrc: state => state.moveResource.src,
    moveResxDest: state => state.moveResource.dest,
    copyResxSrc: state => state.copyResource.src,
    copyResxDest: state => state.copyResource.dest,
    mvCopyMode: state => state.mode,
    getSkipToFinal: state => state.skipToFinal,
    moveResxSrcFormatted: state =>
      state.moveResource && state.moveResource.src.split("/").join(" / "),
    copyResxSrcFormatted: state =>
      state.copyResource && state.copyResource.src.split("/").join(" / "),
    moveResxDestFormatted: state =>
      state.moveResource && state.moveResource.dest.split("/").join(" / "),
    copyResxDestFormatted: state =>
      state.copyResource && state.copyResource.dest.split("/").join(" / "),
  },
};
