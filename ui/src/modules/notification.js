export default {
  state: {
    messages: [],
    read: [],
    unRead: [],
    enabled: false,
  },
  mutations: {
    addMessage(state, { message }) {
      state.messages.push(message);
      state.enabled = true;
    },
    removeMessage(state, id) {
      state.messages = state.messages.filter(message => message.id !== id);
    },
    clearMessages(state) {
      state.messages = [];
    },
    markAsRead(state, id) {
      const idx = state.messages.findIndex(msg => msg.id === id);
      if (idx > -1) {
        let message = state.messages[idx];
        let updatedMessage = Object.assign({}, message, {
          read: true,
        });
        state.messages.splice(idx, 1, updatedMessage);
      }
    },
    updateNotificationStatus(state, { status }) {
      state.enabled = status;
    },
  },
  actions: {
    addMessage({ commit }, message) {
      commit({
        type: "addMessage",
        message,
      });
    },
    removeMessage({ commit }, id) {
      commit({
        type: "removeMessage",
        id,
      });
    },
    clearMessages({ commit }) {
      commit({
        type: "clearMessages",
      });
    },
    markAsRead({ commit }, id) {
      commit({
        type: "markAsRead",
        id,
      });
    },
    updateNotificationStatus({ commit }, status) {
      commit({
        type: "updateNotificationStatus",
        status,
      });
    },
  },
  getters: {
    allMessages: state => state.messages,
    readMessages: state => state.read,
    unreadMessages: state => state.unread,
    getNotificationStatus: state => state.enabled,
    getNewMessage: state => {
      if (state.messages.length > 0) {
        return state.messages[state.messages.length - 1];
      }
    },
  },
};
