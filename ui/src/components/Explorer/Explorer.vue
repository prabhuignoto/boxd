<template>
  <div
    class="explorer-container"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    :class="explorerClass"
  >
    <div class="explorer">
      <header class="explorer-header">
        <ul class="header-wrapper">
          <li class="header control toolbar">
            <Toolbar />
          </li>
          <li class="header control notifications">
            <NotificationsPopdown />
          </li>
          <li class="header control account">
            <Account />
          </li>
        </ul>
      </header>
      <section class="explorer-content">
        <div class="explorer-top-bar">
          <div class="explorer-toolbar-container">
            <ExplorerToolbar />
          </div>
          <div class="explorer-folder-path-container">
            <FolderPath />
          </div>
        </div>
        <ExplorerLineItems :items="items" />
        <!-- <div class="info-message" v-if="canShowWelcomeMessage">
          <span>Drop your files here to upload</span>
        </div> -->
      </section>
    </div>
    <div class="drag-overlay" v-if="dragStart">
      <span class="drag-overlay-icon">
        <UploadIcon />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Toolbar from "../Toolbar/Toolbar.vue";
import Account from "../Account.vue";
import FolderPath from "../Path/FolderPath.vue";
import ExplorerToolbar from "./explorer-toolbar.vue";
import NotificationsPopdown from "../NotificationsCentre/Popdown.vue";
import ExplorerLineItems from "./explorer-line-items.vue";
import Vue from "vue";
import { UploadIcon } from "vue-feather-icons";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { JobType } from "../../modules/jobs";

@Component({
  name: "Explorer",
  components: {
    Account,
    FolderPath,
    ExplorerLineItems,
    Toolbar,
    ExplorerToolbar,
    NotificationsPopdown,
    UploadIcon,
  },
})
export default class extends Vue {
  files = [];
  headers = ["name", "size", "last modified"];
  isLoadingMore = false;
  notificationType = "";
  explorerClass = "";
  dragStart = false;
  items = [];

  @Getter("getFileStatus") getFileStatus;
  @Getter("hasSearchResultsArrived") hasSearchResultsArrived;
  @Getter("getExplorerPath") getExplorerPath;

  @Action("updatePath") updatePath;
  @Action("addJob") addJob;
  @Action("addNodes") addNodes;

  get refetchStatus() {
    return this.$store.state.list.refetchStatus;
  }

  get path() {
    return this.$store.state.explorer.path;
  }

  get canShowFilepaneView() {
    return this.getFileStatus === "open";
  }

  get canShowWelcomeMessage() {
    return !this.$apollo.loading && !this.dragStart;
  }

  handleDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.dragStart = false;
    const {
      dataTransfer: { files },
    } = ev;
    (Array.from(files) as Blob[]).forEach(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadPath", this.getExplorerPath);
      this.addJob({
        jobType: "UPLOAD",
        data: {
          formData,
        },
      });
    });
    this.dragStart = false;
  }

  handleDragOver(ev) {
    this.dragStart = true;
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragEnter(ev) {
    this.dragStart = true;
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragLeave(ev) {
    const classes = Array.from(ev.target.classList);
    if (classes.some(x => x === "drag-overlay")) {
      this.dragStart = false;
    }
  }

  mounted() {
    this.$store.watch(
      (state, getters) =>
        getters.getNodesByPath("explorer-main", this.path ? this.path : "/"),
      nodes => {
        this.items = nodes;
      }
    );
    this.$store.watch(
      (state, getters) => getters.getExplorerPath,
      path => {
        this.addJob({
          jobType: JobType.LIST_FILES,
          data: {
            path,
            treeId: "explorer-main",
          },
        });
      }
    );
  }
}
</script>

<style lang="scss" src="./explorer.scss" scoped></style>
