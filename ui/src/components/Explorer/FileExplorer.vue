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

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "FileExplorer",
  components: {
    Treeview,
  },
  apollo: {
    files: {
      query: FolderGQL,
      debounce: 1000,
      variables() {
        return {
          args: {
            path: this.path,
            limit: 1000,
            cursor: "",
          },
        };
      },
      fetchPolicy: "network-only",
    },
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };
  @Prop() path;

  @Getter("getExplorerPath") getExplorerPath;
  // @Getter("getRefreshFileExplorer") getRefreshFileExplorer;

  @Action("updateTreeViewData") updateTreeViewData;

  onSelect(node) {
    this.$store.dispatch("updateExplorerNode", node);
  }

  handleSubfolderSelection(path) {
    if (path !== this.getExplorerPath) {
      this.$store.dispatch("updatePath", path);
    }
  }
}
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
