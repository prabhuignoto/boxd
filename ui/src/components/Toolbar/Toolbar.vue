<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-buttons">
      <Button
        :onClick="openHome"
        buttonStyle="icon"
        size="large"
        title="Home"
        name="Home"
      >
        <template slot="btn-icon">
          <HomeIcon />
        </template>
      </Button>
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

<script>
import Button from "../Form/Button";
import { mapActions, mapGetters } from "vuex";

import CreateFolder from "../Folder/CreateFolder";
import MoveCopy from "../MoveCopy/MoveCopy";
import UploadWindow from "../Upload/index";
import { UploadIcon, PlusIcon, CopyIcon, HomeIcon } from "vue-feather-icons";
import About from "../About";
import Logout from "../Logout";

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
    // eslint-disable-next-line vue/no-unused-components
    About,
    // eslint-disable-next-line vue/no-unused-components
    Logout,
    UploadIcon,
    PlusIcon,
    CopyIcon,
    HomeIcon,
  },
  computed: {
    ...mapGetters(["getExplorerPath"]),
  },
  methods: {
    ...mapActions([
      "updateModalState",
      "updateWorkflowOrigin",
      "updatePath",
      "clearList",
    ]),
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
        width: 550,
      });
    },
    openHome() {
      if (this.getExplorerPath !== "") {
        this.clearList();
        this.updatePath("");
      }
    },
  },
};
</script>

<style lang="scss" src="./toolbar.scss" scoped />
