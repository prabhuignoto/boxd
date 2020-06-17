<template>
  <section class="dashboard-wrapper">
    <div class="explorer-main">
      <Explorer />
    </div>
    <transition name="fade">
      <div class="modal-area" v-if="isModalActive">
        <Popup
          :content="getPopupComponent"
          :title="getPopupTitle"
          :disableHeader="getIsDisableHeader"
          :width="getModalWidth"
        ></Popup>
      </div>
    </transition>
    <transition name="peek">
      <Notification
        :type="notificationType"
        :title="notificationTitle"
        :message="getNewMessage"
        v-if="getNotificationStatus"
      />
    </transition>
  </section>
</template>

<script>
import Explorer from "../components/Explorer/Explorer.vue";
import Popup from "../components/Popup/Popup";
import { mapGetters, mapActions } from "vuex";
import Notification from "../components/Notification";
import NotificationSub from "../notificationSub.js";
import DeleteFolder from "../components/Folder/DeleteFolder";

export default {
  components: {
    Explorer,
    Popup,
    Notification,
    // eslint-disable-next-line vue/no-unused-components
    DeleteFolder,
  },
  data() {
    return {
      files: {
        entries: [],
      },
      notificationTitle: "",
      notificationType: "",
    };
  },
  computed: {
    ...mapGetters([
      "isModalActive",
      "getPopupComponent",
      "getPopupTitle",
      "getIsDisableHeader",
      "getNotificationStatus",
      "getNewMessage",
      "getModalWidth",
    ]),
  },
  methods: {
    ...mapActions(["addMessage"]),
  },
  apollo: {
    $subscribe: NotificationSub,
  },
};
</script>

<style lang="scss" src="./dashboard.scss" />
