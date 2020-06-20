<template>
  <div class="notification-wrapper">
    <div class="status-icon" :class="message.type">
      <CircleIcon />
    </div>
    <!-- header section -->
    <div class="notification-content">
      <span>{{ message.message }}</span>
      <div @click="handleClose" class="close">
        <XIcon />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import { XIcon, CircleIcon } from "vue-feather-icons";
import Vue from "vue";

export default Vue.extend({
  name: "Notification",
  props: ["message"],
  components: {
    XIcon,
    CircleIcon,
  },
  mounted() {
    // * autoclose the notification if its info
    setTimeout(() => {
      this.handleClose();
    }, 1500);
  },
  updated() {
    setTimeout(() => {
      this.handleClose();
    }, 1500);
  },
  methods: {
    ...mapActions(["updateNotificationStatus", "closeNotification"]),
    handleClose() {
      this.closeNotification(this.message);
    },
  },
});
</script>

<style lang="scss" scoped src="./notification.scss"></style>
