<template>
  <section class="file-explorer-wrapper" :style="getWrapperStyle">
    <Treeview path="" 
      v-bind:onSelect="onSelect"
      v-bind:entries="files.entries"
      childTree="FileExplorer"
      v-bind:handleSubfolderSelection="handleSubfolderSelection" 
      v-if="!$apollo.loading"
    />
    <div class="file-explorer-loader-wrapper" v-if="$apollo.loading">
      <Loader />
    </div>
  </section>
</template>

<script>
import Treeview from "./Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../graphql/folder.gql";
import { mapActions, mapGetters } from "vuex";
import Loader from "./Loader";

export default Vue.component("FileExplorer", {
  components: {
    Treeview,
    Loader
  },
  data() {
    return {
      files: {
        entries: []
      }
    };
  },
  props: ["path"],
  computed: {
    ...mapGetters(["getExplorerPath"]),
    getWrapperStyle() {
      if(this.$apollo.loading) {
        return {
          'min-height': '250px'
        }
      } else {
        return {
          'min-height': '10px'
        }
      }
    }
  },
  methods: {
    ...mapActions(["clearList"]),
    onSelect(node) {
      this.$store.dispatch("updateExplorerNode", node);
    },
    handleSubfolderSelection(path) {
      if(path !== this.getExplorerPath) {
        this.clearList();
        this.$store.dispatch("updatePath", path);
      }
    },
    ...mapActions(["updateTreeViewData"])
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      debounce: 1000,
      variables() {
        return {
          path: this.path,
          limit: 1000,
          cursor: ""
        };
      },
      result({ loading, data }) {
        if (!loading && data.files && data.files.entries) {
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
  .file-explorer-wrapper {
    width: 100%;
    position: relative;
  }
  .file-explorer-loader-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    height: 100%;
  }
</style>
