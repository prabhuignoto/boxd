<template>
  <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerSrc"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  name: "CopyExplorerSrc",
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
  @Action("copyResxSource") copyResxSource;

  onSelect(node) {
    this.copyResxSource(node.path);
  }

  handleSubfolderSelection(path) {
    this.copyResxSource(path);
  }
}
</script>
