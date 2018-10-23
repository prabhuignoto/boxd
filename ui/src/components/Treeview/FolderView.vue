<template>
  <div class="child-tree-wrapper">
    <div @click="toggleTree(entry.path_lower)" class="folder" tabindex="0">
      <i v-if="!folderOpen">
        <img src="../../assets/caret-right.svg" alt="expland">
      </i>
      <i v-if="folderOpen">
        <img src="../../assets/caret-down.svg" alt="collapse">
      </i>
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

<style lang="scss" src="./folderview.scss" />