<template>
  <section class="file-explorer-wrapper">
    <Treeview
      path
      v-bind:onSelect="onSelect"
      v-bind:entries="files.entries"
      childTree="FileExplorer"
      v-bind:handleSubfolderSelection="handleSubfolderSelection"
      v-if="!$apollo.loading"
    />
  </section>
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions, mapGetters } from "vuex";

export default Vue.component("FileExplorer", {
  components: {
    Treeview,
  },
  data() {
    return {
      files: {
        entries: [],
      },
    };
  },
  props: ["path"],
  computed: {
    ...mapGetters(["getExplorerPath", "getRefreshFileExplorer"]),
  },
  watch: {
    getRefreshFileExplorer({ path }) {
      if (path === this.path) {
        this.$apollo.queries.files.refresh();
      }
    },
  },
  methods: {
    ...mapActions(["clearList"]),
    onSelect(node) {
      this.$store.dispatch("updateExplorerNode", node);
    },
    handleSubfolderSelection(path) {
      if (path !== this.getExplorerPath) {
        this.clearList();
        this.$store.dispatch("updatePath", path);
      }
    },
    ...mapActions(["updateTreeViewData"]),
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      debounce: 1000,
      variables() {
        return {
          path: this.path,
          limit: 1000,
          cursor: "",
        };
      },
      fetchPolicy: "cache-and-network",
      // result({ loading, data }) {
      //   if (!loading && data.files && data.files.entries) {
      //   }
      // },
    },
  },
});
</script>

<style lang="scss" scoped>
.file-explorer-wrapper {
  position: relative;
  width: 100%;
}

.file-explorer-loader-wrapper {
  height: 100%;
  left: 0;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}
</style>
