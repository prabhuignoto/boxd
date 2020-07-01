<template>
  <div class="tree-wrapper">
    <Tree
      v-on:selected="handleSelected"
      id="$root"
      v-on:fileSelected="handleFileSelected"
      treeId="copy-explorer-src"
    />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { JobType } from "../../modules/jobs";

@Component({
  name: "CopyExplorerSrc",
  components: {
    Tree,
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Prop() path;
  @Action("copyResxSource") copyResxSource;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  onSelect(node) {
    this.copyResxSource(node.path);
  }

  handleSelected(event: Event, path: string) {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
        treeId: "copy-explorer-src",
      },
    });

    this.copyResxSource(path);
  }

  handleFileSelected(event: Event, path: string) {
    this.copyResxSource(path);
  }

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "copy-explorer-src",
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
