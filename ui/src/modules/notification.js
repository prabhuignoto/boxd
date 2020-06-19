export default {
  state: {
    read: [],
    unRead: [],
    enabled: false,
  },
  mutations: {
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
  },
  actions: {
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
  },
  getters: {
    allMessages: state => state.read.concat(state.unRead),
    readMessages: state => state.read,
    unreadMessages: state => state.unread,
    getNotificationStatus: state => state.enabled,
    getNewMessage: state => {
      if (state.unRead.length > 0) {
        return state.unRead[state.unRead.length - 1];
      }
    },
  },
};
