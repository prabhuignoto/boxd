<template>
  <section class="context-actions-wrapper">
    <Button
      name="Add a Folder here"
      buttonStyle="link"
      :onClick="handleAddFolder"
    >
      <template slot="btn-icon">
        <img src="../../assets/plus-circle-blue.svg" alt="add folder" />
      </template>
    </Button>
    <Button name="Copy this folder" buttonStyle="link" :onClick="handleCopy">
      <template slot="btn-icon">
        <img src="../../assets/copy-blue.svg" alt="copy folder" />
      </template>
    </Button>
    <Button name="Move this folder" buttonStyle="link" :onClick="handleMove">
      <template slot="btn-icon">
        <img src="../../assets/copy-blue.svg" alt="move folder" />
      </template>
    </Button>
    <Button
      name="Delete this folder"
      buttonStyle="link"
      :onClick="handleDelete"
    >
      <template slot="btn-icon">
        <img src="../../assets/times-circle-blue.svg" alt="delete folder" />
      </template>
    </Button>
  </section>
</template>

<script lang="ts">
import Button from "../Form/Button.vue";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  name: "ContextActions",
  components: {
    Button,
  },
})
export default class extends Vue {
  @Prop() path: string;
  @Action("updateMoveCopyMode") updateMoveCopyMode;
  @Action("moveResxSource") moveResxSource;
  @Action("copyResxSource") copyResxSource;
  @Action("updateModalState") updateModalState;
  @Action("skipToFinal") skipToFinal;
  @Action("deleteFolder") deleteFolder;
  @Action("createFolderSelection") createFolderSelection;
  @Action("hideCreateFolderExplorer") hideCreateFolderExplorer;

  handleCopy() {
    this.updateMoveCopyMode("copy");
    this.copyResxSource(this.path);
    this.skipToFinal(true);
    this.updateModalState({
      status: true,
      componentToRender: "MoveCopy",
      title: `Copy folder`,
    });
  }
  handleMove() {
    this.updateMoveCopyMode("move");
    this.moveResxSource(this.path);
    this.skipToFinal(true);
    this.updateModalState({
      status: true,
      componentToRender: "MoveCopy",
      title: `Move folder`,
    });
  }
  handleDelete() {
    this.deleteFolder(this.path);
    this.updateModalState({
      status: true,
      componentToRender: "DeleteFolder",
      title: `Delete`,
    });
  }
  handleAddFolder() {
    this.createFolderSelection(this.path);
    this.hideCreateFolderExplorer(true);
    this.updateModalState({
      status: true,
      componentToRender: "CreateFolder",
      title: "New Folder",
    });
  }
}
</script>

<style lang="scss" scoped>
.context-actions-wrapper {
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 1rem 0;
  width: 100%;
}
</style>
