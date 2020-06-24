<template>
  <div class="popdown-wrapper">
    <div class="not-indicator" v-if="getJobsActive">
      <Loader type="throb" />
    </div>
    <Popdown type="icon" size="large" topOffset="3rem" position="right">
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

<script>
import Popdown from "../Popdown";
import { MessageSquareIcon } from "vue-feather-icons";
import Vue from "vue";
import NotificationCenter from "./index";
import { mapGetters } from "vuex";
import Loader from "../Loader";

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
