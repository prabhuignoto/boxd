<template>
  <div class="notifications-wrapper" ref="not">
    <header class="notifications-header">
      <span class="title">
        Notifications Center
      </span>
      <nav class="notifications-toolbar" v-if="!getJobsEmpty">
        <ul class="toolbar">
          <li class="toolbar-item" @click="handleClear">
            clear all
          </li>
        </ul>
      </nav>
    </header>
    <div class="notifications-table">
      <header class="notifications-header-wrapper" v-if="!getJobsEmpty">
        <ul class="notifications-table-header">
          <li class="header-item">Status</li>
          <li class="header-item">Start Time</li>
          <li class="header-item">End Time</li>
        </ul>
      </header>
      <ul class="notifications all" v-if="!getJobsEmpty">
        <li class="notification" v-for="item of getAllJobs" :key="item.id">
          <div class="notification-container-wrapper">
            <Notification v-bind="item" />
          </div>
        </li>
      </ul>
    </div>
    <div class="no-notifications" v-if="getJobsEmpty">
      <i>
        <ThumbsUpIcon />
      </i>
      <span class="msg">You're all Caught up</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import Notification from "./Notification";
import { ThumbsUpIcon } from "vue-feather-icons";

export default Vue.extend({
  name: "notifications",
  methods: {
    ...mapActions(["clearAllJobs"]),
    handleClear() {
      this.clearAllJobs();
    },
  },
  components: {
    Notification,
    ThumbsUpIcon,
  },
  computed: {
    ...mapGetters([
      "getAllJobs",
      "getAllRunningJobs",
      "getAllCompletedJobs",
      "getJobsEmpty",
    ]),
  },
});
</script>

<style lang="scss" src="./notifications.scss" scoped />
