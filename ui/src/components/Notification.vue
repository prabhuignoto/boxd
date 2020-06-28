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
import { XIcon, CircleIcon } from "vue-feather-icons";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  name: "Notification",
  components: {
    XIcon,
    CircleIcon,
  },
})
export default class extends Vue {
  @Prop() message;
  @Action("updateNotificationStatus") updateNotificationStatus;
  @Action("closeNotification") closeNotification;

  mounted() {
    // * autoclose the notification if its info
    setTimeout(() => {
      this.handleClose();
    }, 1500);
  }

  updated() {
    setTimeout(() => {
      this.handleClose();
    }, 1500);
  }

  handleClose() {
    this.closeNotification(this.message);
  }
}
</script>

<style lang="scss" scoped src="./notification.scss"></style>
