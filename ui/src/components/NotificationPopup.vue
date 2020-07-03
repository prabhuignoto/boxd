<template>
  <div>
    <div class="notification-wrapper">
      <div class="status-icon" :class="notification.type">
        <CircleIcon />
      </div>
      <div class="notification-content">
        <span>{{ notification.message }}</span>
        <div @click="handleClose()" class="close">
          <XIcon />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { Notification as NotificationModel } from "../subModels";
import { XIcon, CircleIcon } from "vue-feather-icons";

@Component({
  name: "NotificationPopup",
  components: {
    XIcon,
    CircleIcon,
  },
})
export default class extends Vue {
  @Prop() notification: NotificationModel;
  @Action("updateNotificationStatus") updateNotificationStatus;
  @Action("closeNotification") closeNotification;

  mounted() {
    setTimeout(() => {
      this.handleClose();
    }, 3000);
  }

  handleClose() {
    this.closeNotification(this.notification);
  }
}
</script>

<style lang="scss" scoped>
.notification-wrapper {
  align-items: flex-start;
  background: #fff;
  border: 1px solid rgba(141, 153, 174, 0.5);
  border-radius: 4px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  font-family: "Nunito", "Open Sans", Arial, Helvetica, sans-serif;
  height: 0;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  max-width: 380px;
  min-height: 50px;
  min-width: 250px;
  padding: 1rem;
  position: relative;
}

.notification-content {
  align-items: center;
  display: flex;
  font-size: 0.75rem;
  font-weight: 500;
  height: 100%;
  justify-content: center;
  padding-left: 1rem;
  width: 80%;

  span {
    font-weight: 500;
    text-align: left;
  }
}

.close {
  height: 1rem;
  margin-left: auto;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  width: 1rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.type-icon {
  color: #007ee5;
  height: 1.25rem;
  margin-right: 1rem;
  width: 1.25rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.status-icon {
  height: 0.7rem;
  left: 0.3rem;
  position: absolute;
  top: 0;
  width: 0.7rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.info {
  color: #4bb543;

  svg {
    fill: #4bb543;
  }
}

.failure {
  color: #f31431;

  svg {
    fill: #f31431;
  }
}
</style>
