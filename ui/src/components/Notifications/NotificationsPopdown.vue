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
import Popdown from "../Popdown.vue";
import { MessageSquareIcon } from "vue-feather-icons";
import Vue from "vue";
import NotificationCenter from "./index.vue";
import { mapGetters } from "vuex";
import Loader from "../Loader.vue";

export default Vue.extend({
  name: "NotificationsPopdown",
  components: {
    Popdown,
    MessageSquareIcon,
    NotificationCenter,
    Loader,
  },
  computed: {
    ...mapGetters(["getJobsActive"]),
  },
});
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
