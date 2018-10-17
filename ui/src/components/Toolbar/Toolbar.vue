<template>
  <div class="toolbar-wrapper">
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
    <Button name="Move or Copy" buttonStyle="rounded" :onClick="openMoveCopy">
      <template slot="btn-icon">
        <img src="../../assets/copy.svg" alt="Copy">
      </template>
    </Button>
    <div class="searchbox-container">
      <SearchBox />
    </div>
    <FolderPath />
  </div>  
</template>

<script>
import Button from "../Form/Button";
import FolderPath from "../Path/FolderPath";
import SearchBox from "../Searchbox";
import { mapActions } from "vuex";
import CreateFolder from "../Folder/CreateFolder";
import MoveCopy from "../MoveCopy/MoveCopy";
import UploadWindow from "../Upload/index";

export default {
  name: "Toolbar",
  components: {
    Button,
    FolderPath,
    SearchBox,
    CreateFolder,
    MoveCopy,
    UploadWindow
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
        title: "Move or Copy"
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
}
</script>

<style lang="scss" scoped>
  .toolbar-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    &:nth-child(2) {
      margin-left: auto;
    }
    .searchbox-container {
      /* margin-left: auto; */
      margin-right: auto
    }
  }
</style>
