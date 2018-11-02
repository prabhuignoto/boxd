<template>
  <div class="notification-wrapper">
    <!-- header section -->
    <header>
      <i class="type-icon">
        <img src="../assets/info-circle.svg" alt="info-icon" v-if="type === 'Informational'">
      </i>
      <span>{{title}}</span>
      <Button :onClick="handleClose">
        <template slot="btn-icon">
          <img src="../assets/cancel.svg" alt="close-notification">
        </template>
      </Button>
    </header>
    <!-- header section -->

    <!-- notification content  -->
    <div class="content">
      <i>
        <img src="../assets/check-green.svg" alt="check green">
      </i>
      <span>{{message.message}}</span>
    </div>
    <!-- notification content  -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Button from "./Form/Button";

export default {
  name: "Notification",
  props: ["message", "type", "title"],
  components: {
    Button,
  },
  mounted() {
    // * autoclose the notification if its informational
    if(this.type === "Informational") {
      setTimeout(() => {
        this.handleClose();
      }, 3000)
    }
  },
  methods: {
    ...mapActions(["updateNotificationStatus"]),
    handleClose() {
      this.updateNotificationStatus(false);
    }
  }
}
</script>

<style lang="scss" scoped src="./notification.scss">
</style>
