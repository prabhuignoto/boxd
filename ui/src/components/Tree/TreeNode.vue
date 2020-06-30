<template>
  <div class="tree-node-wrapper">
    <div
      class="folder-node node"
      v-if="node.type === 'folder'"
      :class="{ disabled: canDisable }"
      @click="handleNodeSelection($event, node.path, node.id)"
    >
      <div class="tnode">
        <span class="tnode-icon">
          <FolderPlusIcon v-if="!expanded && !loading" />
          <FolderMinusIcon v-if="expanded && !loading" />
          <LoaderIcon v-if="loading" class="loader" />
        </span>
        <span class="tnode-name">{{ node.name }}</span>
      </div>
      <div class="child-tree-wrapper" v-show="expanded">
        <Tree
          :id="node.id"
          v-on:selected="handleNodeSelection"
          v-on:fileSelected="handleFileNode"
          isChild="true"
        />
      </div>
    </div>
    <div
      class="file-node node"
      v-if="node.type === 'file'"
      @click="handleFileNode($event, node.path)"
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
import { TreeNode } from "../../modules/tree";

import {
  FileIcon,
  FolderPlusIcon,
  FolderMinusIcon,
  LoaderIcon,
} from "vue-feather-icons";

@Component({
  name: "TreeNode",
  components: {
    Tree: () => import("./index.vue"),
    FileIcon,
    FolderPlusIcon,
    FolderMinusIcon,
    LoaderIcon,
  },
})
export default class extends Vue {
  @Prop() node: TreeNode;
  @Prop() handleFolderSelection;
  @Prop() handleFileSelection;

  expanded = false;
  childrendRendered = false;
  loading = false;

  handleNodeSelection(event: Event, path: string, id: string) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      this.expanded = !this.expanded;
    }

    if (!this.expanded) {
      return;
    }

    this.handleFolderSelection(path, id);

    if (id && !this.childrendRendered) {
      this.loading = true;
    }
  }

  handleFileNode(event: Event, path: string) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.handleFileSelection(path);
  }

  mounted() {
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

  get canDisable() {
    return this.loading;
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
    pointer-events: none;
  }
}

.tnode {
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
}

.tnode-icon {
  align-items: center;
  color: #007ee5;
  display: flex;
  height: 1.45rem;
  margin-right: 0.2rem;
  width: 1.45rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.loader {
  animation: spin 2s linear infinite;
}

.folder-node {
  font-size: 0.9rem;
  font-weight: 400;
}

.file-node {
  font-size: 0.9rem;
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
