<template>
  <section class="dashboard-wrapper">
      <div class="toolbar-container">
        <Toolbar />
      </div>
      <div class="folder-path-container">
        <!-- <FolderPath /> -->
      </div>
      <div class="explorer-main">
        <Explorer />
      </div>
    <transition name="fade">
      <div class="modal-area" v-if="isModalActive">
        <Popup 
          :content="getPopupComponent"
          :title="getPopupTitle"
          :disableHeader="getIsDisableHeader"
        >
        </Popup>
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
import Account from "../components/Account";
import Explorer from "../components/Explorer/Explorer.vue";
import Popup from "../components/Popup/Popup";
import Button from "../components/Form/Button";
import DeleteFolder from "../components/Folder/DeleteFolder";
import Toolbar from "../components/Toolbar/Toolbar";
import gql from "graphql-tag";
import FolderPath from "../components/Path/FolderPath";
// import "../../node_modules/bulma/css/bulma.css";
import Logout from "../components/Logout";
import About from "../components/About";
import { mapGetters, mapActions } from "vuex";
import Notification from "../components/Notification";
import uniqid from "uniqid";
import NotificationSub from "../notificationSub.js";

export default {
  components: {
    Account,
    Explorer,
    Popup,
    Popup,
    Button,
    Toolbar,
    FolderPath,
    Logout,
    About,
    Notification
  },
  data() {
    return {
      files: {
        entries: []
      },
      notificationTitle: "",
      notificationType: ""
    };
  },
  computed: {
    ...mapGetters([
      "isModalActive",
      "getPopupComponent",
      "getPopupTitle",
      "getIsDisableHeader",
      "getNotificationStatus",
      "getNewMessage"
    ])
  },
  methods: {
    ...mapActions(["addMessage"])
  },
  apollo: {
    $subscribe: NotificationSub
  }
};
</script>

<style lang="scss" src="./dashboard.scss" />