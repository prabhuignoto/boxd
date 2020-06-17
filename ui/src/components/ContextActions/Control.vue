<template>
  <div class="context-control">
    <Popdown
      type="icon"
      size="large"
      leftOffset="0rem"
      topOffset="3rem"
      customWidth="180px"
    >
      <template slot="icon">
        <!-- <img src="../../assets/bars.svg" alt="context menu" /> -->
        <BoxIcon color="#fff" />
      </template>
      <template slot="menu">
        <ul class="context-menu">
          <li class="ctx-menu-item" @click="handleAddFolder">
            <span>Add a folder here</span>
          </li>
          <li class="ctx-menu-item" @click="handleUpload" v-if="canShowAction">
            <span>Upload here</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleCopyFolder"
            v-if="canShowAction"
          >
            <span>Copy this folder</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleMoveFolder"
            v-if="canShowAction"
          >
            <span>Move this folder</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleDeleteFolder"
            v-if="canShowAction"
          >
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
import { BoxIcon } from "vue-feather-icons";
import { getFileName } from "../../utils";

export default {
  name: "ContextControl",
  components: {
    Popdown,
    BoxIcon,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getExplorerPath"]),
    canShowAction() {
      return !!this.getExplorerPath;
    },
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
      "updateUploadExplorerStatus",
    ]),
    handleAddFolder() {
      this.updateWorkflowOrigin("context-control");
      this.createFolderSelection(this.path);
      this.hideCreateFolderExplorer(true);
      this.updateModalState({
        status: true,
        componentToRender: "CreateFolder",
        title: "New Folder",
        width: 480,
      });
    },
    handleCopyFolder() {
      this.updateMoveCopyMode("copy");
      this.copyResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: `Copy ${getFileName(this.path)}`,
        width: 480,
      });
    },
    handleMoveFolder() {
      this.updateMoveCopyMode("move");
      this.moveResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: `Move ${getFileName(this.path)}`,
        width: 480,
      });
    },
    handleDeleteFolder() {
      this.deleteFolder(this.path);
      this.updateModalState({
        status: true,
        componentToRender: "DeleteFolder",
        title: `Delete ${getFileName(this.path)}`,
        width: 480,
      });
    },
    handleUpload() {
      this.uploadFile(this.path);
      this.updateUploadExplorerStatus(false);
      this.updateModalState({
        status: true,
        componentToRender: "UploadWindow",
        title: "Upload",
        width: 550,
      });
    },
  },
};
</script>

<style lang="scss" src="./control.scss" scoped />
