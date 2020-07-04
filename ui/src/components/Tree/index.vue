<template>
  <div class="tree-view-wrapper">
    <div class="tree-view-item" v-for="tNode of nodes" :key="tNode.id">
      <TreeNode
        :node="tNode"
        :handleFolderSelection="handleFolderSelection"
        :handleFileSelection="handleFileSelection"
        :treeId="treeId"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TreeNode as TreeNodeModel, NodeType } from "../../modules/models";
import TreeNode from "./TreeNode.vue";

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

  handleFolderSelection(path: string) {
    this.$emit("selected", null, path);
  }

  handleFileSelection(path: string) {
    this.$emit("fileSelected", null, path);
  }

  mounted() {
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
