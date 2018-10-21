<template>
  <div class="context-control">
    <Popdown type="icon" size="medium" leftOffset="-5.5rem">
      <template slot="icon">
        <img src="../../assets/cog-gray.svg" alt="context menu">
      </template>
      <template slot="menu">
        <ul class="context-menu">
          <li class="ctx-menu-item" @mousedown="handleAddFolder">
            <i>
              <img src="../../assets/add_flat.svg" alt="add">
            </i>
            <span>Add a folder here</span>
          </li>
          <li class="ctx-menu-item" @mousedown="handleUpload">
            <i>
              <img src="../../assets/upload_flat.svg" alt="upload">
            </i>
            <span>Upload here</span>
          </li>
          <li class="ctx-menu-item" @mousedown="handleCopyFolder">
            <i>
              <img src="../../assets/copy_flat.svg" alt="copy folder">
            </i>
            <span>Copy this folder</span>
          </li>
          <li class="ctx-menu-item" @mousedown="handleMoveFolder">
            <i>
              <img src="../../assets/copy_flat.svg" alt="Move folder">
            </i>
            <span>Move this folder</span>
          </li>
          <li class="ctx-menu-item" @mousedown="handleDeleteFolder">
            <i>
              <img src="../../assets/cross_flat.svg" alt="Delete folder">
            </i>
            <span>Delete this folder</span>
          </li>
        </ul>
      </template>
    </Popdown>
  </div>
</template>

<script>
import Popdown from "../Popdown/index";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ContextControl",
  components: {
    Popdown
  },
  props: ["path"],
  methods: {
    ...mapActions([
      "updateMoveCopyMode",
      "moveResxSource",
      "copyResxSource",
      "updateModalState",
      "skipToFinal",
      "deleteFolder",
      "createFolderSelection",
      "hideCreateFolderExplorer"
    ]),
    handleAddFolder() {
      this.createFolderSelection(this.path);
      this.hideCreateFolderExplorer(true);
      this.updateModalState({
        status: true,
        componentToRender: 'CreateFolder',
        title: 'New Folder'
      })
    },
    handleCopyFolder() {
      this.updateMoveCopyMode("copy");
      this.copyResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: 'MoveCopy',
        title: `Copy folder`
      })
    },
    handleMoveFolder() {
      this.updateMoveCopyMode("move");
      this.moveResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: 'MoveCopy',
        title: `Move folder`
      })
    },
    handleDeleteFolder() {
      this.deleteFolder(this.path);
      this.updateModalState({
        status: true,
        componentToRender: 'DeleteFolder',
        title: `Delete`
      })
    },
    handleUpload() {
      this.updateModalState({
        status: true,
        componentToRender: "UploadWindow",
        title: "Upload"
      });
    }
  }  
}
</script>

<style lang="scss" src="./context-control.scss" />

