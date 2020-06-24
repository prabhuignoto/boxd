<template>
  <div class="explorer-container">
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
        <section class="load-more" v-if="hasMoreData && !isLoadingMore">
          <a href="javascript:void(0);" @click="handleLoadMore"
            >Show More ...</a
          >
        </section>
        <div
          class="info-message"
          v-if="getDataList.length < 1 && !$apollo.loading"
        >
          <span>You have no folders or files here.</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions, mapGetters } from "vuex";
import Toolbar from "../Toolbar/Toolbar.vue";
import Account from "../Account.vue";
import FolderPath from "../Path/FolderPath.vue";
import ExplorerToolbar from "./explorer-toolbar.vue";
import NotificationsPopdown from "../Notifications/NotificationsPopdown";
import ExplorerLineItems from "./explorer-line-items";
import Vue from "vue";

export default Vue.extend({
  name: "Explorer",
  components: {
    Account,
    FolderPath,
    ExplorerLineItems,
    Toolbar,
    ExplorerToolbar,
    NotificationsPopdown,
  },
  data() {
    return {
      files: [],
      headers: ["name", "size", "last modified"],
      isLoadingMore: false,
      notificationType: "",
    };
  },
  watch: {
    refetchStatus: function ({ status }) {
      if (status) {
        this.$apollo.queries.files.refresh();
      }
    },
  },
  computed: {
    ...mapGetters([
      "getFileStatus",
      "getDataList",
      "getCursor",
      "hasMoreData",
      "hasSearchResultsArrived",
      "isUserSearching",
      "searchCount",
    ]),
    refetchStatus() {
      return this.$store.state.list.refetchStatus;
    },
    path() {
      return this.$store.state.explorer.path;
    },
    canShowFilepaneView() {
      return this.getFileStatus === "open";
    },
  },
  methods: {
    ...mapActions([
      "updatePath",
      "updateListData",
      "clearList",
      "clearSearch",
      "refetchData",
      "removeItemsFromList",
    ]),
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
    },
    handleNavBackToExplorer() {
      this.clearSearch();
      this.clearList();
      this.refetchData(true);
    },
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path,
          limit: 10,
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
        }
      },
      fetchPolicy: "cache-and-network",
    },
    // $subscribe: BatchSub,
  },
});
</script>

<style lang="scss" src="./explorer.scss" scoped></style>
