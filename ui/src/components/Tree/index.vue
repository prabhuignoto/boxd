<template>
  <div class="tree-view-wrapper">
    <div class="folder-node" v-if="node.type === type.folder">
      {{ node.name }}
      <!-- <component :is="Tree" v-if="node.children.length"></component> -->
    </div>
    <div class="file-node" v-if="node.type === type.file">
      {{ node.name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TreeNode, NodeType } from "../../modules/tree";

@Component({
  name: "Tree",
  components: {
    Tree: () => import("./index.vue"),
  },
})
export default class extends Vue {
  @Prop() node: TreeNode;

  type = NodeType;
}
</script>
