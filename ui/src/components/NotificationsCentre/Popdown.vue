<template>
  <div class="popdown-wrapper">
    <div class="not-indicator" v-if="getJobsActive">
      <Loader type="throb" />
    </div>
    <Popdown
      type="icon"
      size="large"
      topOffset="3rem"
      position="right"
      customWidth="550"
    >
      <template slot="icon">
        <i class="image-wrapper">
          <MessageSquareIcon />
        </i>
      </template>
      <template slot="menu">
        <NotificationCenter />
      </template>
    </Popdown>
  </div>
</template>

<script lang="ts">
import Popdown from "../Popdown/index.vue";
import { MessageSquareIcon } from "vue-feather-icons";
import Vue from "vue";
import NotificationCenter from "./index.vue";
import Loader from "../Loader.vue";

import { Getter } from "vuex-class";
import { Component } from "vue-property-decorator";

@Component({
  name: "NotificationsPopdown",
  components: {
    Popdown,
    MessageSquareIcon,
    NotificationCenter,
    Loader,
  },
})
export default class extends Vue {
  @Getter("getJobsActive") getJobsActive;
}
</script>

<style lang="scss" scoped>
.popdown-wrapper {
  position: relative;
}

.not-indicator {
  position: absolute;
  right: 11px;
  top: 2px;
  z-index: 999;
}

.notification-menu-wrapper {
  background: #fff;
  padding: 0.2rem;
}
</style>
