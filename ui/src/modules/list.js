export default {
  state: {
    data: [],
    cursor: "",
    hasMore: false
  },
  mutations: {
    updateListData(state, { listData, cursor, hasMore }) {
      state.data = state.data.slice(0).concat(listData);
      state.cursor = cursor;
      state.hasMore = hasMore;
    },
    clearList(state) {
      state.data = [];
      state.cursor = "";
      state.hasMore = false;
    }
  },
  actions: {
    updateListData({ commit }, { listData, cursor, hasMore }) {
      commit({
        type: "updateListData",
        listData,
        cursor,
        hasMore
      });
    },
    clearList({ commit }) {
      commit({
        type: "clearList"
      });
    }
  },
  getters: {
    getDataList: state => state.data,
    getCursor: state => state.cursor,
    hasMoreData: state => state.hasMore
  }
};
