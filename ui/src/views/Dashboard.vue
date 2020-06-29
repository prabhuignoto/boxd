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
      <Notification :message="getNewMessage" v-if="getNewMessage" />
    </transition>
    <JobRunner />
  </section>
</template>

<script>
import Explorer from "../components/Explorer/Explorer.vue";
import Popup from "../components/Popup/Popup";
import Notification from "../components/Notification";
import JobRunner from "../components/JobRunner";
import NotificationSub from "../notificationSub";
import DeleteFolder from "../components/Folder/DeleteFolder";

import { Component } from "vue-property-decorator";
import Vue from "vue";
import { Action, Getter } from "vuex-class";

@Component({
  name: "Dashboard",
  components: {
    Explorer,
    Popup,
    Notification,
    DeleteFolder,
    JobRunner,
  },
  apollo: {
    $subscribe: NotificationSub,
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Getter("isModalActive") isModalActive;
  @Getter("getPopupComponent") getPopupComponent;
  @Getter("getPopupTitle") getPopupTitle;
  @Getter("getIsDisableHeader") getIsDisableHeader;
  @Getter("getNotificationStatus") getNotificationStatus;
  @Getter("getNewMessage") getNewMessage;
  @Getter("getModalWidth") getModalWidth;
  @Getter("getExplorerPath") getExplorerPath;
  @Getter("getJobsActive") getJobsActive;

  @Action("showNotification") showNotification;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("refetchData") refetchData;
}
</script>

<style lang="scss" src="./dashboard.scss" />
