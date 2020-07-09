<template>
  <div class="tree-wrapper">
    <Tree v-on:selected="handleSelected" id="$root" treeId="move-explorer-dest" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import Tree from "../Tree/index.vue";
import { JobType } from "../../modules/jobs";

@Component({
  name: "MoveExplorerDest",
  components: {
    Tree,
  },
})
export default class extends Vue {
  @Prop() path;
  @Prop() actionName;

  files = {
    entries: [],
  };

  @Getter("isBulkModeEnabled") isBulkModeEnabled;
  @Getter("getActiveBulkRecords") getActiveBulkRecords;

  @Action("moveResxDest") moveResxDest;
  @Action("updateDestForMoveResxBulk") updateDestForMoveResxBulk;
  @Action("setMoveResxBulk") setMoveResxBulk;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  handleSelected(event: Event, { path, id }: { path: string; id: string }) {
    if (path !== "/") {
      this.addJob({
        jobType: JobType.LIST_FILES,
        data: {
          path,
          treeId: "move-explorer-dest",
        },
      });
    }

    this.moveResxDest({ path, id });

    if (this.isBulkModeEnabled) {
      this.setMoveResxBulk(
        this.getActiveBulkRecords.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForMoveResxBulk(path);
    }
  }

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "move-explorer-dest",
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
