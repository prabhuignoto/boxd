<template>
  <div class="tree-node-wrapper">
    <div
      class="folder-node node"
      v-if="node.type === 'folder'"
      :class="{ disabled: canDisable }"
      @click="handleNodeSelection($event, { path: node.path, id: node.id })"
    >
      <div class="tnode">
        <span class="tnode-icon">
          <FolderPlusIcon v-if="showFolderPlus" />
          <FolderMinusIcon v-if="showFolderMinus" />
          <FolderIcon v-if="showFolder" />
          <LoaderIcon v-if="loading" class="loader" />
        </span>
        <span class="tnode-name">{{ node.name }}</span>
      </div>
      <div class="child-tree-wrapper" v-show="expanded">
        <Tree
          :id="node.id"
          :treeId="treeId"
          v-on:selected="handleNodeSelection"
          v-on:fileSelected="handleFileNode"
          v-if="node.id !== '$root'"
        />
      </div>
    </div>
    <div
      class="file-node node"
      v-if="node.type === 'file'"
      @click="handleFileNode($event, { path: node.path, id: node.id })"
    >
      <div class="tnode">
        <span class="tnode-icon">
          <FileIcon />
        </span>
        <span class="tnode-name">{{ node.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import Component from "vue-class-component";

import {
  FileIcon,
  FolderIcon,
  FolderMinusIcon,
  FolderPlusIcon,
  LoaderIcon,
} from "vue-feather-icons";
import { TreeNode } from "../../modules/models";
import { TreeSelection } from "./tree-node.model";

@Component({
  name: "TreeNode",
  components: {
    Tree: () => import("./index.vue"),
    FileIcon,
    FolderIcon,
    FolderMinusIcon,
    FolderPlusIcon,
    LoaderIcon,
  },
})
export default class extends Vue {
  @Prop() node: TreeNode;
  @Prop() handleFolderSelection;
  @Prop() handleFileSelection;
  @Prop() treeId;

  expanded = false;
  childrendRendered = false;
  loading = false;

  handleNodeSelection(event: Event, { path, id }: TreeSelection): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      this.expanded = !this.expanded;
    }

    this.handleFolderSelection({ path, id });

    if (!this.childrendRendered && id !== "$root") {
      this.loading = true;
    }
  }

  handleFileNode(event: Event, { path, id }: TreeSelection): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.handleFileSelection({ path, id });
  }

  mounted(): void {
    const unWatch = this.$watch(
      "node.children",
      function () {
        this.loading = false;
        this.childrendRendered = true;
        unWatch();
      },
      {
        deep: true,
      }
    );
  }

  get canDisable(): boolean {
    return Boolean(this.loading || this.node.locked);
  }

  get showFolderPlus(): boolean {
    return this.node.id !== "$root" && !this.expanded && !this.loading;
  }

  get showFolderMinus(): boolean {
    return this.node.id !== "$root" && this.expanded && !this.loading;
  }

  get showFolder(): boolean {
    return this.node.id === "$root" && !this.loading;
  }
}
</script>

<style lang="scss" scoped>
.child-tree-wrapper {
  margin-left: 1rem;
}

.node {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  font-family: Nunito, Courier New, Courier, monospace;
  justify-content: flex-start;

  &.disabled {
    opacity: 0.75;
    pointer-events: none;
    user-select: none;
  }
}

.tnode {
  align-items: center;
  border-radius: 0.2rem;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  padding: 0.2rem 0.35rem;

  &:hover {
    background: #cce5f9;
  }
}

.tnode-icon {
  align-items: center;
  color: #007ee5;
  display: flex;
  height: 1.5rem;
  margin-right: 0.2rem;
  width: 1.5rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.loader {
  animation: spin 2s linear infinite;
}

.folder-node {
  font-size: 1rem;
  font-weight: 400;
}

.file-node {
  font-size: 0.85rem;
  font-weight: 400;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
