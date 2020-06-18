export default {
  state: {
    data: [],
    cursor: "",
    hasMore: false,
    search: "",
    searchResults: {
      data: [],
    },
    refetchStatus: false,
    bulkOps: [],
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
    },
    updateSearch(state, { term }) {
      state.search = term;
    },
    updateSearchResults(state, { data }) {
      state.searchResults.data = data;
    },
    clearSearch(state) {
      state.searchResults.data = [];
      state.search = "";
    },
    refetchData(state, status) {
      state.refetchStatus = status;
    },
    addItemForBulk(state, { item }) {
      state.bulkOps = state.bulkOps.concat(item);
    },
    removeItemFromBulk(state, { item }) {
      state.bulkOps = state.bulkOps.filter(
        i => i.path_lower !== item.path_lower
      );
    },
    clearAllBulk(state) {
      state.bulkOps = [];
    },
  },
  actions: {
    updateListData({ commit }, { listData, cursor, hasMore }) {
      commit({
        type: "updateListData",
        listData,
        cursor,
        hasMore,
      });
    },
    clearList({ commit }) {
      commit({
        type: "clearList",
      });
    },
    updateSearch({ commit }, term) {
      commit({
        type: "updateSearch",
        term,
      });
    },
    clearSearch({ commit }) {
      commit({
        type: "clearSearch",
      });
    },
    updateSearchResults({ commit }, data) {
      commit({
        type: "updateSearchResults",
        data,
      });
    },
    refetchData({ commit }, status) {
      commit({
        type: "refetchData",
        status,
      });
    },
    addItemForBulk({ commit }, item) {
      commit({
        type: "addItemForBulk",
        item,
      });
    },
    removeItemFromBulk({ commit }, item) {
      commit({
        type: "removeItemFromBulk",
        item,
      });
    },
    clearAllBulk({ commit }, item) {
      commit({
        type: "clearAllBulk",
        item,
      });
    },
  },
  getters: {
    getDataList: state => {
      if (state.searchResults.data.length > 0) {
        return state.searchResults.data;
      } else {
        return state.data;
      }
    },
    getCursor: state => state.cursor,
    hasMoreData: state => state.hasMore,
    isUserSearching: state =>
      state.search && state.searchResults.data.length > 0,
    searchCount: state => state.searchResults.data.length,
    getBulkItems: state => state.bulkOps,
  },
};
