<template>
  <div class="child-tree-wrapper">
    <div @click="toggleTree(entry.path_lower)" class="folder" tabindex="0">
      <i class="folder-icon">
        <FolderPlusIcon v-if="!folderOpen" />
        <FolderMinusIcon v-if="folderOpen" />
      </i>
      <span class="folder-name">{{ name }}</span>
    </div>
    <div class="child-tree" v-if="entry.path_lower !== null">
      <component
        v-bind:is="childTree"
        v-bind:path="entry.path_lower"
        v-show="showTree"
        v-bind:handleSubfolderSelection="handleSubfolderSelection"
      ></component>
    </div>
  </div>
</template>

<script>
import { FolderPlusIcon, FolderMinusIcon } from "vue-feather-icons";
export default {
  name: "FolderView",
  props: ["name", "entry", "childTree", "handleSubfolderSelection"],
  data() {
    return {
      showTree: false,
      folderOpen: false,
      highlight: false,
    };
  },
  components: {
    FolderPlusIcon,
    FolderMinusIcon,
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
    },
  },
};
</script>

<style lang="scss" src="./folderview.scss" scoped />
