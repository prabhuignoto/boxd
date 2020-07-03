import { ActionTree, MutationTree, GetterTree, Module } from "vuex";
import { RootState } from "@/store";

interface Notification {
  id: string;
  message: string;
}

interface NotificationState {
  read: Notification[];
  unRead: Notification[];
  enabled: boolean;
}

const actions: ActionTree<NotificationState, RootState> = {
  showNotification({ commit }, message) {
    commit({
      type: "showNotification",
      message,
    });
  },
  closeNotification({ commit }, message) {
    commit({
      type: "closeNotification",
      message,
    });
  },
  clearMessages({ commit }) {
    commit({
      type: "clearMessages",
    });
  },
};

const mutations: MutationTree<NotificationState> = {
  showNotification(state, { message }) {
    state.unRead.push(message);
  },
  closeNotification(state, { message }) {
    state.unRead = state.unRead.filter(m => m.id !== message.id);
    state.read.push(message);
  },
  clearMessages(state) {
    state.read = [];
    state.unRead = [];
  },
};

const getters: GetterTree<NotificationState, RootState> = {
  allMessages: state => state.read.concat(state.unRead),
  readMessages: state => state.read,
  unreadMessages: state => state.unRead,
  getNotificationStatus: state => state.enabled,
  getNewMessage: state => {
    if (state.unRead.length > 0) {
      return state.unRead[state.unRead.length - 1];
    } else {
      return null;
    }
  },
  getAllUnreadMessages: state => state.unRead,
};

export default {
  state: {
    read: [],
    unRead: [],
    enabled: false,
  },
  actions,
  mutations,
  getters,
} as Module<NotificationState, RootState>;
