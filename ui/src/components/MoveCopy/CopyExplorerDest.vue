<template>
  <div class="tree-wrapper">
    <Tree
      v-on:selected="handleSelected"
      id="$root"
      treeId="copy-explorer-dest"
    />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { JobType } from "../../modules/jobs";

@Component({
  name: "CopyExplorerDest",
  components: {
    Tree,
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

  @Action("copyResxDest") copyResxDest;
  @Action("setCopyResxBulk") setCopyResxBulk;
  @Action("updateDestForCopyResxBulk") updateDestForCopyResxBulk;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  onSelect(node) {
    this.copyResxDest(node.path);
    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(node.path);
    }
  }

  handleSubfolderSelection(path) {
    this.copyResxDest(path);
    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(path);
    }
  }

  handleSelected(event: Event, path: string) {
    this.copyResxDest(path);

    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
        treeId: "copy-explorer-dest",
      },
    });

    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(path);
    }
  }

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "copy-explorer-dest",
      },
    });
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  padding: 0 0.5rem;
  width: 90%;
}
</style>
