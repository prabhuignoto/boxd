<template>
  <Treeview
    path
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="MoveExplorerDest"
    hideFiles="true"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";
import { mapActions, mapGetters } from "vuex";

export default Vue.component("MoveExplorerDest", {
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
  computed: {
    ...mapGetters(["getBulkMode", "getBulkItems"]),
  },
  props: ["path", "actionName"],
  methods: {
    ...mapActions([
      "moveResxDest",
      "updateDestForMoveResxBulk",
      "setMoveResxBulk",
    ]),
    onSelect(node) {
      this.moveResxDest(node.path);
      if (this.getBulkMode) {
        this.setMoveResxBulk(
          this.getBulkItems.map(item => ({
            fromPath: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForMoveResxBulk(node.path);
      }
    },
    handleSubfolderSelection(path) {
      this.moveResxDest(path);
      if (this.getBulkMode) {
        this.setMoveResxBulk(
          this.getBulkItems.map(item => ({
            fromPath: item.path_lower,
            id: item.id,
          }))
        );
        this.updateDestForMoveResxBulk(path);
      }
    },
  },
  apollo: {
    files: {
      query: FolderGQL,
      fetchPolicy: "network-only",
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
