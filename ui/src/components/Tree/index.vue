<template>
  <div class="tree-view-wrapper">
    <div class="tree-view-item" v-for="tNode of nodes" :key="tNode.id">
      <TreeNode
        :node="tNode"
        :handleFolderSelection="handleFolderSelection"
        :handleFileSelection="handleFileSelection"
        :treeId="treeId"
        :hideFiles="hideFiles"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TreeNode as TreeNodeModel, NodeType } from "../../modules/models";
import TreeNode from "./TreeNode.vue";
import { TreeSelection } from "./tree-node.model";

@Component({
  name: "Tree",
  components: {
    TreeNode,
  },
})
export default class extends Vue {
  nodes: TreeNodeModel[] = [];
  type = NodeType;

  @Prop() id: string;
  @Prop() treeId: string;
  @Prop() hideFiles: boolean;

  handleFolderSelection({ path, id }: TreeSelection): void {
    this.$emit("selected", null, { path, id });
  }

  handleFileSelection({ path, id }: TreeSelection): void {
    this.$emit("fileSelected", null, { path, id });
  }

  mounted(): void {
    this.$store.watch(
      (state, getters) => getters.getChildNodesById(this.treeId, this.id),
      nodes => {
        if (nodes && nodes.length) {
          this.nodes = nodes;
        }
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.tree-view-wrapper {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  width: 100%;
}

.tree-view-item {
  text-align: left;
}
</style>
