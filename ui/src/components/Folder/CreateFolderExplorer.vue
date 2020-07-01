<template>
  <div class="tree-wrapper">
    <Tree
      v-on:selected="handleSelected"
      id="$root"
      treeId="create-folder-explorer"
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
  name: "CreateFolderExplorer",
  components: {
    Tree,
  },
})
export default class extends Vue {
  @Prop() path;

  files = {
    entries: [],
  };
  selectedPath = this.path;

  @Action("addJob") addJob;
  @Action("createFolderSelection") createFolderSelection;

  handleSubfolderSelection(path) {
    this.createFolderSelection(path);
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
        treeId: "create-folder-explorer",
      },
    });
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.createFolderSelection(path);
  }

  mounted() {
    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path: "",
        treeId: "create-folder-explorer",
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
