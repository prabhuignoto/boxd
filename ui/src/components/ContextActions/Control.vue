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
        <BoxIcon color="#fff" />
      </template>
      <template slot="menu">
        <ul class="context-menu">
          <li class="ctx-menu-item" @click="handleAddFolder">
            <i class="ctx-menu-icon">
              <PlusIcon />
            </i>
            <span>Add a folder here</span>
          </li>
          <li class="ctx-menu-item" @click="handleUpload">
            <i class="ctx-menu-icon">
              <UploadIcon />
            </i>
            <span>Upload here</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleCopyFolder"
            v-if="canShowAction"
          >
            <i class="ctx-menu-icon">
              <CopyIcon />
            </i>
            <span>Copy this folder</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleMoveFolder"
            v-if="canShowAction"
          >
            <i class="ctx-menu-icon">
              <ArrowRightIcon />
            </i>
            <span>Move this folder</span>
          </li>
          <li
            class="ctx-menu-item"
            @click="handleDeleteFolder"
            v-if="canShowAction"
          >
            <i class="ctx-menu-icon">
              <TrashIcon />
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
import {
  BoxIcon,
  ArrowRightIcon,
  TrashIcon,
  CopyIcon,
  UploadIcon,
  PlusIcon,
} from "vue-feather-icons";
import { getFileName } from "../../utils";

export default {
  name: "ContextControl",
  components: {
    Popdown,
    BoxIcon,
    PlusIcon,
    ArrowRightIcon,
    TrashIcon,
    CopyIcon,
    UploadIcon,
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
