<template>
  <div class="notification-wrapper-container">
    <div v-for="item in messages" :key="item.id">
      <NotificationPopup :notification="item" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Notification as NotificationModel } from "../subModels";
import NotificationPopup from "./NotificationPopup.vue";

@Component({
  name: "Notification",
  components: {
    NotificationPopup,
  },
})
export default class extends Vue {
  @Prop() messages: NotificationModel[];
}
</script>

<style lang="scss" scoped src="./notification.scss"></style>
