<template>
  <div class="tree-wrapper">
    <Tree v-on:selected="handleSelected" id="$root" treeId="upload-explorer" />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { JobType } from "../../modules/jobs";

@Component({
  name: "UploadExplorer",
  components: {
    Tree,
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Prop() path: string;

  @Action("createFolderSelection") createFolderSelection;
  @Action("uploadFile") uploadFile;
  @Getter("getUploadPath") getUploadPath;
  @Action("addJob") addJob;

  selectedPath = this.path;

  handleSubfolderSelection(path): void {
    this.uploadFile(path);
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.uploadFile(path);
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
