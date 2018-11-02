<template>
  <div class="context-control">
    <Popdown type="icon" size="large" leftOffset="-4.25rem" topOffset="2.5rem" customWidth="160px">
      <template slot="icon">
        <img src="../../assets/bars.svg" alt="context menu">
      </template>
      <template slot="menu">
        <ul class="context-menu">
          <li class="ctx-menu-item" @click="handleAddFolder">
            <span>Add a folder here</span>
          </li>
          <li class="ctx-menu-item" @click="handleUpload">
            <span>Upload here</span>
          </li>
          <li class="ctx-menu-item" @click="handleCopyFolder">
            <span>Copy this folder</span>
          </li>
          <li class="ctx-menu-item" @click="handleMoveFolder">
            <span>Move this folder</span>
          </li>
          <li class="ctx-menu-item" @click="handleDeleteFolder">
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
  props: {
    path: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions([
      "updateMoveCopyMode",
      "moveResxSource",
      "copyResxSource",
      "updateModalState",
      "skipToFinal",
      "deleteFolder",
      "createFolderSelection",
      "hideCreateFolderExplorer",
      "updateWorkflowOrigin",
      "uploadFile",
      "updateUploadExplorerStatus"
    ]),
    handleAddFolder() {
      this.updateWorkflowOrigin("context-control");
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
      this.uploadFile(this.path);
      this.updateUploadExplorerStatus(false);
      this.updateModalState({
        status: true,
        componentToRender: "UploadWindow",
        title: "Upload"
      });
    }
  }  
}
</script>

<style lang="scss" src="./control.scss" scoped/>

