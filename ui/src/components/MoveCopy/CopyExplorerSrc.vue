<template>
  <div class="tree-wrapper">
    <Tree
      id="$root"
      treeId="copy-explorer-src"
      v-on:selected="handleSelected"
      v-on:fileSelected="handleFileSelected"
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
  selectedPath: string | null = null;

  @Prop() path;
  @Action("copyResxSource") copyResxSource;
  @Action("addNodes") addNodes;
  @Action("addJob") addJob;

  get canFireQuery() {
    return this.selectedPath !== "/";
  }

  handleSelected(event: Event, path: string) {
    this.copyResxSource(path);
    this.selectedPath = path;

    if (this.canFireQuery) {
      this.addJob({
        jobType: JobType.LIST_FILES,
        data: {
          path,
          treeId: "copy-explorer-src",
        },
      });
    }
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
