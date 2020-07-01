<template>
  <div class="tree-wrapper">
    <Tree
      v-on:selected="handleSelected"
      id="$root"
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
import { TreeNode } from "../../modules/tree";
import { JobType } from "../../modules/jobs";

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

  handleSelected(event: Event, path: string) {
    this.moveResxSource(path);
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
        treeId: "move-explorer-src",
      },
    });
  }

  handleFileSelected(event: Event, path: string) {
    this.moveResxSource(path);
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
