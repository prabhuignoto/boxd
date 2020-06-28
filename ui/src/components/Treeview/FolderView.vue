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

<script lang="ts">
import { FolderPlusIcon, FolderMinusIcon } from "vue-feather-icons";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "FolderView",
  components: {
    FolderPlusIcon,
    FolderMinusIcon,
  },
})
export default class extends Vue {
  @Prop() name;
  @Prop() entry;
  @Prop() childTree;
  @Prop() handleSubfolderSelection;

  showTree = false;
  folderOpen = false;
  highlight = false;

  toggleTree(path: string) {
    this.showTree = !this.showTree;
    this.folderOpen = !this.folderOpen;
    this.handleSubfolderSelection(path);
    this.highlight = !this.highlight;
  }

  showHighlight() {
    this.highlight = true;
  }

  hideHighlight() {
    this.highlight = false;
  }
}
</script>

<style lang="scss" src="./folderview.scss" scoped />
