<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-buttons">
      <Button :onClick="openUploadWindow" buttonStyle="icon" size="large">
        <template slot="btn-icon">
          <HomeIcon />
        </template>
      </Button>
      <Button :onClick="openUploadWindow" buttonStyle="icon" size="large">
        <template slot="btn-icon">
          <UploadIcon />
        </template>
      </Button>
      <Button :onClick="openCreateFolder" buttonStyle="icon" size="large">
        <template slot="btn-icon">
          <PlusIcon />
        </template>
      </Button>
      <Button :onClick="openMoveCopy" buttonStyle="icon" size="large">
        <template slot="btn-icon">
          <CopyIcon />
        </template>
      </Button>
    </div>
    <div class="folder-path-container">
      <FolderPath />
    </div>
  </div>
</template>

<script>
import Button from "../Form/Button";
import { mapActions } from "vuex";

import CreateFolder from "../Folder/CreateFolder";
import MoveCopy from "../MoveCopy/MoveCopy";
import FolderPath from "../Path/FolderPath";
import UploadWindow from "../Upload/index";
import { UploadIcon, PlusIcon, CopyIcon, HomeIcon } from "vue-feather-icons";

export default {
  name: "Toolbar",
  components: {
    Button,
    // eslint-disable-next-line vue/no-unused-components
    CreateFolder,
    // eslint-disable-next-line vue/no-unused-components
    MoveCopy,
    // eslint-disable-next-line vue/no-unused-components
    UploadWindow,
    UploadIcon,
    PlusIcon,
    CopyIcon,
    HomeIcon,
    FolderPath,
  },
  methods: {
    ...mapActions(["updateModalState", "updateWorkflowOrigin"]),
    openCreateFolder() {
      this.updateWorkflowOrigin("toolbar");
      this.updateModalState({
        status: true,
        componentToRender: "CreateFolder",
        title: "Add folder",
        width: 500,
      });
    },
    openMoveCopy() {
      this.updateWorkflowOrigin("toolbar");
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: "Choose an Option",
        width: 500,
      });
    },
    openUploadWindow() {
      this.updateWorkflowOrigin("toolbar");
      this.updateModalState({
        status: true,
        componentToRender: "UploadWindow",
        title: "Upload",
        width: 500,
      });
    },
  },
};
</script>

<style lang="scss" src="./toolbar.scss" scoped />
