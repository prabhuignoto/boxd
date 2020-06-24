<template>
  <div class="notifications-wrapper" ref="not">
    <header class="notifications-header-wrapper" v-if="!getJobsEmpty">
      <ul class="notifications-header">
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
    ...mapActions([]),
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
