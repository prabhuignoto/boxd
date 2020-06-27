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

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";
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
            fromPath: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForCopyResxBulk(node.path);
      }
    },
    handleSubfolderSelection(path) {
      this.copyResxDest(path);
      if (this.getBulkMode) {
        this.setCopyResxBulk(
          this.getBulkItems.map(item => ({
            fromPath: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForCopyResxBulk(path);
      }
    },
  },
  apollo: {
    files: {
      query: FolderGQL,
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
