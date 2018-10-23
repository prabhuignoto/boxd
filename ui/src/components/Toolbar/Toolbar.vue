<template>
  <div class="toolbar-wrapper">
    <div class="toolbar-buttons">
      <Button name="Upload" size="large" buttonStyle="rounded" :onClick="openUploadWindow">
        <template slot="btn-icon">
          <img src="../../assets/upload.svg" alt="upload">
        </template>
      </Button>
      <Button name="Add folder" size="large" buttonStyle="rounded" :onClick="openCreateFolder">
        <template slot="btn-icon">
          <img src="../../assets/plus.svg" alt="add">
        </template>
      </Button>
      <Button name="Move / Copy" buttonStyle="rounded" :onClick="openMoveCopy">
        <template slot="btn-icon">
          <img src="../../assets/copy.svg" alt="Copy">
        </template>
      </Button>
      <div class="searchbox-container-desk">
        <SearchBox />
      </div>
    </div>
    <div class="searchbox-container-mob">
      <SearchBox />
    </div>
    <div class="account-settings-wrapper">
      <Account />
    </div>
  </div>  
</template>

<script>
import Button from "../Form/Button";
import SearchBox from "../Searchbox";
import { mapActions } from "vuex";
import CreateFolder from "../Folder/CreateFolder";
import MoveCopy from "../MoveCopy/MoveCopy";
import UploadWindow from "../Upload/index";
import Account from "../Account";

export default {
  name: "Toolbar",
  components: {
    Button,
    SearchBox,
    CreateFolder,
    MoveCopy,
    UploadWindow,
    Account
  },
  methods: {
    ...mapActions(["updateModalState"]),
    openCreateFolder() {
      this.updateModalState({
        status: true,
        componentToRender: "CreateFolder",
        title: "Add folder"
      });
    },
    openMoveCopy() {
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: "Select an operation to proceed further"
      });
    },
    openUploadWindow() {
      this.updateModalState({
        status: true,
        componentToRender: "UploadWindow",
        title: "Upload"
      });
    }
  }
};
</script>

<style lang="scss" src="./toolbar.scss" />
