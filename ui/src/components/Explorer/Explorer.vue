<template>
  <div class="explorer-container">
    <!-- <TreeviewWrapper /> -->
    <div class="explorer">
      <header class="explorer-header">
        <ul class="header-wrapper">
          <li class="header control context">
            <ContextControl :path="path" type="link" name="Random" />
          </li>
          <li class="header control toolbar">
            <Toolbar />
          </li>
          <li class="header control search">
            <SearchBox />
          </li>
          <li class="header control account">
            <Account />
          </li>
        </ul>
      </header>
      <section class="explorer-content">
        <div class="explorer-top-bar">
          <div>
            <MenuIcon />
          </div>
          <div class="explorer-folder-path-container">
            <FolderPath />
          </div>
          <div class="explorer-toolbar-container" v-if="getBulkItems.length">
            <ExplorerToolbar />
          </div>
        </div>
        <div class="loader-container" v-if="$apollo.loading">
          <Loader size="2x" />
        </div>
        <div
          class="line-item-wrapper search-results-row"
          v-if="isUserSearching"
        >
          <span class="search-results-message">
            <a href="javascript:void(0);" @click="handleNavBackToExplorer"
              >Back to explorer</a
            >
            <span
              >found {{ searchCount }} items matching the search criteria</span
            >
          </span>
        </div>
        <!-- <transition-group name="list-fade"> -->
        <div
          class="line-item-wrapper"
          v-for="file in getDataList"
          :key="file.name"
        >
          <LineItem
            v-bind="file"
            v-on:selected="handleLineItemSelection"
            v-on:deselected="handleLineItemDeselection"
          />
        </div>
        <!-- </transition-group> -->
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
import Loader from "../Loader";
import LineItem from "./Explorer-LineItem";
import { mapActions, mapGetters } from "vuex";
import ContextControl from "../ContextActions/Control";
import Toolbar from "../Toolbar/Toolbar";
import Account from "../Account";
import FolderPath from "../Path/FolderPath";
import ExplorerToolbar from "./explorer-toolbar";
import BatchSub from "../../batchSub";
import SearchBox from "../Searchbox";
import { MenuIcon } from "vue-feather-icons";
import Vue from "vue";

export default Vue.extend({
  name: "Explorer",
  components: {
    Account,
    ContextControl,
    FolderPath,
    LineItem,
    Loader,
    SearchBox,
    Toolbar,
    ExplorerToolbar,
    MenuIcon,
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
      "getBulkItems",
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
      "addItemForBulk",
      "removeItemFromBulk",
      "markBulkCompletion",
      "showNotification",
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
    handleLineItemSelection(data) {
      this.addItemForBulk(data);
    },
    handleLineItemDeselection(data) {
      this.removeItemFromBulk(data);
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
    $subscribe: BatchSub,
  },
});
</script>

<style lang="scss" src="./explorer.scss" scoped></style>
