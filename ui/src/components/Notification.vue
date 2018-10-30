<template>
  <div class="notification-wrapper">
    <!-- header section -->
    <header>
      <i class="type-icon">
        <img src="../assets/info-circle.svg" alt="info-icon" v-if="type === 'Informational'">
      </i>
      <span>{{title}}</span>
      <button @click="handleClose">
        <i>
          <img src="../assets/cancel.svg" alt="close-notification">
        </i>
      </button>
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

export default {
  name: "Notification",
  props: ["message", "type", "title"],
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

<style lang="scss" scoped>
  .notification-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-width: 200px;
    max-width: 500px;
    min-height: 30px;
    background: #EDF2F4;
    border-radius: 4px;
    border: 1px solid rgba(141, 153, 174, 0.5);
    box-shadow: 0 0 10px 1px rgba(0,0,0,0.2);
    position: fixed;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(85vh);
    padding-bottom: 1rem;

    header {
      font-family: "Open Sans", Arial, Helvetica, sans-serif;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.5rem 0;
      span {
        padding-left: 0.5rem;
        font-weight: 500;
      }
      button {
        border: none;
        margin-left: auto;
        padding: 0;
        background: none;
        i {
          height: 1rem;
          width: 1rem;
        }
      }
    }
    .content {
      text-align: left;
      padding: 0.25rem 0.5rem;
      font-size: 0.9rem;
      min-height: 50px;
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      word-break: break-word; 
    }
    i {
      width: 1.25rem;
      height: 1.25rem;
      margin-left: 0.5rem;
    }
  }
</style>
