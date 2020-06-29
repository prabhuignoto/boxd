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

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "MoveExplorerDest",
  components: {
    Treeview,
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
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Prop() path;
  @Prop() actionName;

  @Getter("getBulkMode") getBulkMode;
  @Getter("getBulkItems") getBulkItems;

  @Action("moveResxDest") moveResxDest;
  @Action("updateDestForMoveResxBulk") updateDestForMoveResxBulk;
  @Action("setMoveResxBulk") setMoveResxBulk;

  onSelect(node) {
    this.moveResxDest(node.path);
    if (this.getBulkMode) {
      this.setMoveResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForMoveResxBulk(node.path);
    }
  }

  handleSubfolderSelection(path) {
    this.moveResxDest(path);
    if (this.getBulkMode) {
      this.setMoveResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForMoveResxBulk(path);
    }
  }
}
</script>
