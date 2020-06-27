import { MutationTree, ActionTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

interface ListState {
  data: any[];
  cursor: string;
  hasMore: boolean;
  search: string;
  searchResults: {
    data: any[];
  };
  refetchStatus: boolean;
  bulkOps: any[];
}

const mutations: MutationTree<ListState> = {
  updateListData(state, { listData, cursor, hasMore }) {
    state.data = state.data.slice(0).concat(
      listData.map((x: any) =>
        Object.assign({}, x, {
          hidden: false,
        })
      )
    );
    state.cursor = cursor;
    state.hasMore = hasMore;
  },
  removeFromList(state, { path }) {
    state.data = state.data.filter(item => item.path_lower !== path);
  },
  removeItemsFromList(state, { ids }) {
    state.data = state.data.filter(item => ids.indexOf(item.id) < 0);
  },
  clearList(state) {
    state.data = [];
    state.cursor = "";
    state.hasMore = false;
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
  addItemsForBulk(state, { items }) {
    state.bulkOps = items;
  },
  removeItemFromBulk(state, { item }) {
    state.bulkOps = state.bulkOps.filter(i => i.path_lower !== item.path_lower);
  },
  removeItemsFromBulk(state) {
    state.bulkOps = [];
  },
  clearAllBulk(state) {
    state.bulkOps = [];
  },
  lockItems(state, { items, lockType, jobId }) {
    state.bulkOps = state.bulkOps.map(i => {
      if (items.indexOf(i.id) > -1) {
        return Object.assign({}, i, {
          locked: true,
          jobId,
        });
      } else {
        return i;
      }
    });
    state.data = state.data.map(item => {
      if (items.indexOf(item.id) >= 0) {
        return Object.assign({}, item, {
          locked: true,
          lockType,
          jobId,
        });
      }
      return item;
    });
  },
  unLockItems(state, { jobId, failed }) {
    state.bulkOps = state.bulkOps.filter(f => f.jobId !== jobId);
    state.data = state.data.map(item => {
      const canHide = item.lockType === "MOVE" || item.lockType === "DELETE";
      if (item.jobId && item.jobId === jobId) {
        return Object.assign({}, item, {
          locked: false,
          lockType: null,
          jobId: null,
          hidden: !failed && canHide,
        });
      }
      return item;
    });
  },
};

const actions: ActionTree<ListState, RootState> = {
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
  addItemsForBulk({ commit }, items) {
    commit({
      type: "addItemsForBulk",
      items,
    });
  },
  removeItemFromBulk({ commit }, item) {
    commit({
      type: "removeItemFromBulk",
      item,
    });
  },
  removeItemsFromBulk({ commit }) {
    commit({
      type: "removeItemsFromBulk",
    });
  },
  clearAllBulk({ commit }) {
    commit({
      type: "clearAllBulk",
    });
  },
  removeFromList({ commit }, path) {
    commit({
      type: "removeFromList",
      path,
    });
  },
  removeItemsFromList({ commit }, ids) {
    commit({
      type: "removeItemsFromList",
      ids,
    });
  },
  lockItems({ commit }, { items, lockType, jobId }) {
    commit({
      type: "lockItems",
      items,
      lockType,
      jobId,
    });
  },
  unLockItems({ commit }, { jobId, failed }) {
    commit({
      type: "unLockItems",
      jobId,
      failed,
    });
  },
};

const getters: GetterTree<ListState, RootState> = {
  getDataList: state => {
    if (state.searchResults.data.length > 0) {
      return state.searchResults.data;
    } else {
      return state.data.filter(item => !item.hidden);
    }
  },
  getCursor: state => state.cursor,
  hasMoreData: state => state.hasMore,
  isUserSearching: state => state.search && state.searchResults.data.length > 0,
  searchCount: state => state.searchResults.data.length,
  getBulkItems: state => {
    return state.bulkOps.filter(f => !f.locked);
  },
};

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
  mutations,
  actions,
  getters,
} as Module<ListState, RootState>;
