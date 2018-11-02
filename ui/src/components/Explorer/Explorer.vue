<template>
  <div class="explorer-container">
    <TreeviewWrapper />
    <!-- <FolderPath /> -->
    <div class="explorer">
      <header class="explorer-header">
        <ul class="header-wrapper">
          <li class="header control">
            <ContextControl :path="path" type="link" name="Random"/>
          </li>
          <li v-for="header in headers" :key="header" v-bind:class="`${header} header`">{{header}}</li>
          <li class="header empty">
          </li>
        </ul>
      </header>
      <section class="explorer-content">
        <div class="loader-container" v-if="$apollo.loading">
          <Loader />
        </div>
        <div class="line-item-wrapper search-results-row" v-if="isUserSearching">
          <span class="search-results-message">
            <a href="javascript:void(0);" @click="handleNavBackToExplorer">
              Back to explorer
            </a>
            <span>found {{searchCount}} items matching the search criteria</span>
          </span>
        </div>
        <transition-group name="list-fade">
          <div class="line-item-wrapper" v-for="file in getDataList" :key="file.name">
            <LineItem v-bind="file"/>
          </div>
        </transition-group>
        <section class="load-more" v-if="hasMoreData && !isLoadingMore">
          <a href="javascript:void(0);" @click="handleLoadMore">
            Show More ...
          </a>
        </section>
        <div class="info-message" v-if="getDataList.length<1 && !$apollo.loading">
          <span>You have no folders or files here.</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import FolderPath from "../Path/FolderPath";
import FolderGQL from "../../graphql/folder.gql";
import Loader from "../Loader";
import FileExplorer from "./FileExplorer";
import LineItem from "./Explorer-LineItem";
import SearchBox from "../Searchbox";
import RootFolder from "../rootFolder";
import { mapActions, mapGetters } from "vuex";
import ContextControl from "../ContextActions/Control";
import ContextActions from "../ContextActions/index.vue";
import TreeviewWrapper from "./TreeviewWrapper";

export default {
  name: "Explorer",
  components: {
    LineItem,
    FolderPath,
    Loader,
    SearchBox,
    FileExplorer,
    RootFolder,
    ContextControl,
    ContextActions,
    TreeviewWrapper
  },
  data() {
    return {
      files: [],
      headers: ["name", "size", "last modified"],
      isLoadingMore: false
    };
  },
  watch: {
    refetchStatus: function({ status }, oldData) {
      if (status) {
        this.$apollo.queries.files.refresh();
      }
    }
  },
  computed: {
    ...mapGetters([
      "getFileStatus",
      "getDataList",
      "getCursor",
      "hasMoreData",
      "hasSearchResultsArrived",
      "isUserSearching",
      "searchCount"
    ]),
    refetchStatus() {
      return this.$store.state.list.refetchStatus;
    },
    path() {
      return this.$store.state.explorer.path;
    },
    canShowFilepaneView() {
      return this.getFileStatus === "open";
    }
  },
  methods: {
    ...mapActions([
      "updatePath",
      "updateListData",
      "clearList",
      "clearSearch",
      "refetchData"
    ]),
    handleLoadMore() {
      this.isLoadingMore = true;
      this.$apollo.queries.files.fetchMore({
        variables: {
          cursor: this.getCursor,
          limit: 10,
          path: this.path
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const {
            files: { cursor, entries: listData, hasMore }
          } = fetchMoreResult;
          this.updateListData({ listData, cursor, hasMore });
          this.isLoadingMore = false;
        }
      });
    },
    handleNavBackToExplorer() {
      this.clearSearch();
      this.clearList();
      this.refetchData(true);
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path,
          limit: 10,
          cursor: ""
        };
      },
      result({ loading, data }) {
        if (!loading && data && !this.isLoadingMore) {
          const {
            files: { cursor, entries: listData, hasMore }
          } = data;
          this.clearList();
          this.updateListData({ listData, cursor, hasMore });
        }
      },
      fetchPolicy: "cache-and-network"
    }
  }
};
</script>

<style lang="scss" src="./explorer.scss" scoped>
</style>


