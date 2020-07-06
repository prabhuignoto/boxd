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
      <!-- <Notification :message="getNewMessage" v-if="getNewMessage" /> -->
      <Notifications :messages="getAllUnreadMessages"></Notifications>
    </transition>
    <JobRunner />
    <Pusher />
  </section>
</template>

<script>
import Explorer from "../components/Explorer/Explorer.vue";
import Popup from "../components/Popup/Popup";
import Notifications from "../components/Notifications.vue";
import JobRunner from "../components/JobRunner";
import Pusher from "../components/Pusher";
import NotificationSub from "../notificationSub";
import DeleteFolder from "../components/Folder/DeleteFolder";

import { Component } from "vue-property-decorator";
import Vue from "vue";
import { Action, Getter } from "vuex-class";
import { JobType } from "../modules/jobs";

@Component({
  name: "Dashboard",
  components: {
    Explorer,
    Popup,
    Notifications,
    DeleteFolder,
    JobRunner,
    Pusher,
  },
  apollo: {
    $subscribe: NotificationSub,
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };
  Notification = "Notification";

  @Getter("isModalActive") isModalActive;
  @Getter("getPopupComponent") getPopupComponent;
  @Getter("getPopupTitle") getPopupTitle;
  @Getter("getIsDisableHeader") getIsDisableHeader;
  @Getter("getNotificationStatus") getNotificationStatus;
  @Getter("getAllUnreadMessages") getAllUnreadMessages;
  @Getter("getModalWidth") getModalWidth;
  @Getter("getExplorerPath") getExplorerPath;
  @Getter("getJobsActive") getJobsActive;

  @Action("showNotification") showNotification;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("addJob") addJob;

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "explorer-main",
      },
    });
  }
}
</script>

<style lang="scss" src="./dashboard.scss" />
