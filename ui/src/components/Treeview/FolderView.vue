<template>
  <div class="child-tree-wrapper">
    <div @click="toggleTree(entry.path_lower)" class="folder" tabindex="0">
      <img src="../../assets/folder.svg" alt="folder" v-bind:class="{folderImg: true, open: folderOpen}">
      <span>{{name}}</span>
    </div>
    <div class="child-tree" v-if="entry.path_lower !== null">
      <component
        v-bind:is="childTree"
        v-bind:path="entry.path_lower"
        v-show="showTree"
        v-bind:handleSubfolderSelection="handleSubfolderSelection"></component>
    </div>
  </div>
</template>

<script>
import Treeview from "./Treeview";
export default {
  name: "FolderView",
  props: ["name", "entry", "childTree", "handleSubfolderSelection"],
  data() {
    return {
      showTree: false,
      folderOpen: false,
      highlight: false
    };
  },
  methods: {
    toggleTree(path) {
      this.showTree = !this.showTree;
      this.folderOpen = !this.folderOpen;
      this.handleSubfolderSelection(path);
      this.highlight = !this.highlight;
    },
    showHighlight() {
      this.highlight = true;
    },
    hideHighlight() {
      this.highlight = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.child-tree-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.child-tree {
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 0.1rem;
}
.folder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem; 
  cursor: pointer;
  &:focus {
    outline: 1px solid #007ee5;
    outline-offset: 2px;
  }
}
.folderImg {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}
</style>

