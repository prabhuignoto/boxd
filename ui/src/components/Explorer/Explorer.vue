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
        <ExplorerLineItems :items="getDataList" />
        <!-- <section class="load-more" v-if="hasMoreData && !isLoadingMore">
          <a href="javascript:void(0);" @click="handleLoadMore"
            >Show More ...</a
          >
        </section>-->
        <div class="info-message" v-if="canShowWelcomeMessage">
          <span>You have no folders or files here.</span>
        </div>
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
import FolderGQL from "../../graphql/folder";
import Toolbar from "../Toolbar/Toolbar.vue";
import Account from "../Account.vue";
import FolderPath from "../Path/FolderPath.vue";
import ExplorerToolbar from "./explorer-toolbar.vue";
import NotificationsPopdown from "../Notifications/NotificationsPopdown.vue";
import ExplorerLineItems from "./explorer-line-items.vue";
import Vue from "vue";
import { UploadIcon } from "vue-feather-icons";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { TreeNode } from "../../modules/tree";

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
  // watch: {
  //   refetchStatus: function ({ status }) {
  //     if (status) {
  //       this.$apollo.queries.files.refresh();
  //     }
  //   },
  // },
  apollo: {
    files: {
      query: FolderGQL,
      variables() {
        return {
          path: this.path,
          limit: 50,
          cursor: "",
        };
      },
      result({ loading, data }) {
        if (!loading && data && !this.isLoadingMore) {
          const {
            files: { cursor, entries: listData, hasMore },
          } = data;
          this.clearList();
          this.updateListData({ listData, cursor, hasMore });
          debugger;
          this.addNodes({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes: (listData as any[]).map<TreeNode>(entry => ({
              name: entry.name,
              id: entry.id,
              path: entry.path_lower,
              type: entry.tag,
              serverModified: entry.server_modified,
              size: entry.size,
              hash: entry.content_hash,
              children: [],
            })),
          });
        }
      },
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class extends Vue {
  files = [];
  headers = ["name", "size", "last modified"];
  isLoadingMore = false;
  notificationType = "";
  explorerClass = "";
  dragStart = false;

  @Getter("getFileStatus") getFileStatus;
  @Getter("getDataList") getDataList;
  @Getter("getCursor") getCursor;
  @Getter("hasMoreData") hasMoreData;
  @Getter("hasSearchResultsArrived") hasSearchResultsArrived;
  @Getter("isUserSearching") isUserSearching;
  @Getter("searchCount") searchCount;
  @Getter("getExplorerPath") getExplorerPath;

  @Action("updatePath") updatePath;
  @Action("updateListData") updateListData;
  @Action("clearList") clearList;
  @Action("clearSearch") clearSearch;
  @Action("refetchData") refetchData;
  @Action("removeItemsFromList") removeItemsFromList;
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
    return (
      this.getDataList.length < 1 && !this.$apollo.loading && !this.dragStart
    );
  }

  handleLoadMore() {
    this.isLoadingMore = true;
    this.$apollo.queries.files.fetchMore({
      variables: {
        cursor: this.getCursor,
        limit: 10,
        path: this.path,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const {
          files: { cursor, entries: listData, hasMore },
        } = fetchMoreResult;
        this.updateListData({ listData, cursor, hasMore });
        this.isLoadingMore = false;
      },
    });
  }

  handleNavBackToExplorer() {
    this.clearSearch();
    this.clearList();
    this.refetchData(true);
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
}
</script>

<style lang="scss" src="./explorer.scss" scoped></style>
