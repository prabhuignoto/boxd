<template>
  <div class="tree-view-wrapper">
    <div class="tree-view-item" v-for="tNode of nodes" :key="tNode.id">
      <TreeNode
        :node="tNode"
        :handleFolderSelection="handleFolderSelection"
        :handleFileSelection="handleFileSelection"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TreeNode as TreeNodeModel, NodeType } from "../../modules/tree";
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
  @Prop() isChild: boolean;

  handleFolderSelection(path: string) {
    this.$emit("selected", null, path);
  }

  handleFileSelection(path: string) {
    this.$emit("fileSelected", null, path);
  }

  mounted() {
    this.$store.watch(
      (state, getters) => getters.getChildNodesById(this.id),
      nodes => {
        if (nodes && nodes.length) {
          this.nodes = nodes;
          // unwatch();
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
  margin: 0.2rem 0;
  text-align: left;
  width: 100%;
}
</style>
