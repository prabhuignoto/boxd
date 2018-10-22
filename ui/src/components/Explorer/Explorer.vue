<template>
  <div class="explorer-container">
    <div class="tree-view-wrapper is-hidden-mobile">
      <header class="tree-view-header">
        <img src="../../assets/sitemap.svg" alt="explorer" class="file-explorer-icon">
        <span>File Explorer</span>
      </header>
      <div class="tree-view-content">
        <RootFolder :onClick="handleRootFolder" />
        <FileExplorer path="" />
      </div>
    </div>
    <!-- <FolderPath /> -->
    <div class="explorer">
      <header class="explorer-header">
        <ul class="header-wrapper">
          <li v-for="header in headers" :key="header" v-bind:class="header">{{header}}</li>
          <li class="header empty">
          </li>
        </ul>
        <!-- <div class="ctx-control-container"> -->
          <!-- <ContextControl :path="path"/> -->
        <!-- </div> -->
      </header>
      <!-- <section class="context-container">
        <ContextActions :path="path" />
      </section> -->
      <section class="explorer-content">
        <div class="loader-container" v-if="$apollo.loading">
          <Loader size="large">
          </Loader>
        </div>
        <div class="line-item-wrapper" v-for="file in files.entries" :key="file.name" v-if="!$apollo.loading">
          <LineItem v-bind="file"/>
        </div>
        <div class="info-message" v-if="files.entries.length<1 && !$apollo.loading">
          <span>You have no folders or files here.</span>
        </div>
      </section>
      <!-- <section class="file-pane-view" v-if="canShowFilepaneView">
        <FilePane />
      </section> -->
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import FolderPath from "../Path/FolderPath";
import FolderGQL from "../../graphql/folder.gql";
import Loader from "../Loader";
import FileExplorer from "../FileExplorer";
import LineItem from "./explorer-lineItem";
import SearchBox from "../Searchbox";
import RootFolder from "../rootFolder";
import { mapActions, mapGetters } from "vuex";
import ContextControl from "../ContextActions/Control";
import ContextActions from "../ContextActions/index.vue";
import "../../../node_modules/bulma/css/bulma.css";

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
  },
  data() {
    return {
      files: [],
      headers: ["name", "size", "last modified"]
    };
  },
  computed: {
    ...mapGetters(["getFileStatus"]),
    path() {
      return this.$store.state.explorer.path;
    },
    canShowFilepaneView() {
      return this.getFileStatus === "open"
    }
  },
  methods: {
    ...mapActions(["updatePath"]),
    handleRootFolder() {
      this.updatePath("");
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        };
      }
    }
  }
};
</script>

<style lang="scss" src="./explorer.scss">
</style>


