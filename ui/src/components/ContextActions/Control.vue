<template>
  <div class="context-control">
    <Popdown type="icon" size="medium" leftOffset="-4.75rem">
      <template slot="icon">
        <img src="../../assets/cog-gray.svg" alt="context menu">
      </template>
      <template slot="menu">
        <ul class="context-menu">
          <li class="ctx-menu-item" @click="handleAddFolder">
            <i>
              <img src="../../assets/add_flat.svg" alt="add">
            </i>
            <span>Add a folder here</span>
          </li>
          <li class="ctx-menu-item" @click="handleCopyFolder">
            <i>
              <img src="../../assets/copy_flat.svg" alt="copy folder">
            </i>
            <span>Copy this folder</span>
          </li>
          <li class="ctx-menu-item" @click="handleMoveFolder">
            <i>
              <img src="../../assets/copy_flat.svg" alt="Move folder">
            </i>
            <span>Move this folder</span>
          </li>
          <li class="ctx-menu-item" @click="handleDeleteFolder">
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
    }
  }  
}
</script>

<style lang="scss" scoped>
  .context-menu {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    color: #000;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    li {
      padding: 1rem 0;
      text-align: left;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      &:hover {
        background: rgba(0, 126, 229, 0.2);
      }

      i {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        img {
          object-fit: contain;
          object-position: 50% 50%;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>

