<template>
  <div class="tree-wrapper">
    <Tree id="$root" treeId="copy-explorer-dest" v-on:selected="handleSelected" :hideFiles="true" />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { JobType } from "../../modules/jobs";
import { TreeSelection } from "../Tree/tree-node.model";

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

  @Getter("isBulkModeEnabled") isBulkModeEnabled;
  @Getter("getActiveBulkRecords") getActiveBulkRecords;

  @Action("copyResxDest") copyResxDest;
  @Action("setCopyResxBulk") setCopyResxBulk;
  @Action("updateDestForCopyResxBulk") updateDestForCopyResxBulk;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  onSelect(node) {
    this.copyResxDest(node.path);
    if (this.isBulkModeEnabled) {
      this.setCopyResxBulk(
        this.getActiveBulkRecords.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(node.path);
    }
  }

  handleSelected(event: Event, { path, id }: TreeSelection) {
    this.copyResxDest({ path, id });

    if (path !== "/") {
      this.addJob({
        jobType: JobType.LIST_FILES,
        data: {
          path,
          treeId: "copy-explorer-dest",
        },
      });
    }

    if (this.isBulkModeEnabled) {
      this.setCopyResxBulk(
        this.getActiveBulkRecords.map(item => ({
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
