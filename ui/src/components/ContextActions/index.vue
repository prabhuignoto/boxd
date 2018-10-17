<template>
  <section class="context-actions-wrapper">
    <Button name="Add a Folder here" buttonStyle="link" :onClick="handleAddFolder"/>
    <Button name="Copy this folder" buttonStyle="link" :onClick="handleCopy"/>
    <Button name="Move this folder" buttonStyle="link" :onClick="handleMove"/>
    <Button name="Delete this folder" buttonStyle="link" :onClick="handleDelete"/>
  </section>
</template>

<script>
import Button from "../Form/Button";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ContextActions",
  components: {
    Button
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
    handleCopy() {
      this.updateMoveCopyMode("copy");
      this.copyResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: 'MoveCopy',
        title: `Copy folder`
      })
    },
    handleMove() {
      this.updateMoveCopyMode("move");
      this.moveResxSource(this.path);
      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: 'MoveCopy',
        title: `Move folder`
      })
    },
    handleDelete() {
      this.deleteFolder(this.path);
      this.updateModalState({
        status: true,
        componentToRender: 'DeleteFolder',
        title: `Delete`
      })
    },
    handleAddFolder() {
      this.createFolderSelection(this.path);
      this.hideCreateFolderExplorer(true);
      this.updateModalState({
        status: true,
        componentToRender: 'CreateFolder',
        title: 'New Folder'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.context-actions-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0.75rem 0;
  background: rgba(0, 126, 229, 0.06);
}
</style>
