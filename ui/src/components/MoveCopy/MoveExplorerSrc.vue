<template>
  <div class="tree-wrapper">
    <Tree
      id="$root"
      v-on:selected="handleSelected"
      v-on:fileSelected="handleFileSelected"
      treeId="move-explorer-src"
    />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { TreeNode } from "../../modules/models";
import { JobType } from "../../modules/jobs";
import { TreeSelection } from "../Tree/tree-node.model";

@Component({
  name: "MoveExplorerSrc",
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
  @Prop() skipQuery;

  @Getter("getNodesByPath") getNodesByPath: (path: string) => TreeNode[];

  @Action("moveResxSource") moveResxSource;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  handleSelected(event: Event, { path, id }: TreeSelection) {
    this.moveResxSource({ path, id });

    if (path !== "/") {
      this.addJob({
        jobType: JobType.LIST_FILES,
        data: {
          path,
          treeId: "move-explorer-src",
        },
      });
    }
  }

  handleFileSelected(event: Event, { path, id }: TreeSelection) {
    this.moveResxSource({ path, id });
  }

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "move-explorer-src",
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
