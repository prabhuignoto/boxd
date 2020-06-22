<template>
  <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerDest"
    hideFiles="true"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions, mapGetters } from "vuex";

export default Vue.component("CopyExplorerDest", {
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
  props: ["path", "actionName"],
  computed: {
    ...mapGetters(["getBulkMode", "getBulkItems"]),
  },
  methods: {
    ...mapActions([
      "copyResxDest",
      "setCopyResxBulk",
      "updateDestForCopyResxBulk",
    ]),
    onSelect(node) {
      this.copyResxDest(node.path);
      if (this.getBulkMode) {
        this.setCopyResxBulk(
          this.getBulkItems.map(item => ({
            from_path: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForCopyResxBulk(node.path);
      }
    },
    handleSubfolderSelection(path) {
      debugger;
      this.copyResxDest(path);
      if (this.getBulkMode) {
        this.setCopyResxBulk(
          this.getBulkItems.map(item => ({
            from_path: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForCopyResxBulk(path);
      }
    },
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path,
          cursor: "",
          limit: 1000,
        };
      },
    },
  },
});
</script>
