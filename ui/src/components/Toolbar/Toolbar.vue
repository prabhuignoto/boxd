<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-buttons">
      <!-- <Button
        :onClick="openHome"
        buttonStyle="icon"
        size="large"
        title="Home"
        name="Home"
      >
        <template slot="btn-icon">
          <HomeIcon />
        </template>
      </Button> -->
      <Button
        :onClick="openUploadWindow"
        buttonStyle="icon"
        size="large"
        title="upload"
        name="upload"
      >
        <template slot="btn-icon">
          <UploadIcon />
        </template>
      </Button>
      <Button
        :onClick="openCreateFolder"
        buttonStyle="icon"
        size="large"
        title="Add folder"
        name="Add folder"
      >
        <template slot="btn-icon">
          <PlusIcon />
        </template>
      </Button>
      <Button
        :onClick="openMoveCopy"
        buttonStyle="icon"
        size="large"
        title="Move/Copy"
        name="Move or Copy"
      >
        <template slot="btn-icon">
          <CopyIcon />
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import Button from "../Form/Button.vue";

import CreateFolder from "../Folder/CreateFolder.vue";
import MoveCopy from "../MoveCopy/MoveCopy.vue";
import UploadWindow from "../Upload/index.vue";
import { UploadIcon, PlusIcon, CopyIcon } from "vue-feather-icons";
import About from "../About.vue";
import Logout from "../Logout.vue";
import Vue from "vue";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "Toolbar",
  components: {
    Button,
    // eslint-disable-next-line vue/no-unused-components
    CreateFolder,
    // eslint-disable-next-line vue/no-unused-components
    MoveCopy,
    // eslint-disable-next-line vue/no-unused-components
    UploadWindow,
    // eslint-disable-next-line vue/no-unused-components
    About,
    // eslint-disable-next-line vue/no-unused-components
    Logout,
    UploadIcon,
    PlusIcon,
    CopyIcon,
    // HomeIcon,
  },
})
export default class extends Vue {
  @Action("updateModalState") updateModalState;
  @Action("updateWorkflowOrigin") updateWorkflowOrigin;
  @Action("updatePath") updatePath;
  @Action("clearList") clearList;

  @Getter("getExplorerPath") getExplorerPath;

  openCreateFolder() {
    this.updateWorkflowOrigin("toolbar");
    this.updateModalState({
      status: true,
      componentToRender: "CreateFolder",
      title: "Add folder",
      width: 500,
    });
  }
  openMoveCopy() {
    this.updateWorkflowOrigin("toolbar");
    this.updateModalState({
      status: true,
      componentToRender: "MoveCopy",
      title: "Choose an Option",
      width: 500,
    });
  }
  openUploadWindow() {
    this.updateWorkflowOrigin("toolbar");
    this.updateModalState({
      status: true,
      componentToRender: "UploadWindow",
      title: "Upload",
      width: 550,
    });
  }
  openHome() {
    if (this.getExplorerPath !== "") {
      this.clearList();
      this.updatePath("");
    }
  }
}
</script>

<style lang="scss" src="./toolbar.scss" scoped />
