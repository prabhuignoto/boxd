<template>
  <div class="tree-wrapper">
    <Tree
      v-on:selected="handleSelected"
      id="$root"
      v-on:fileSelected="handleFileSelected"
    />
  </div>
</template>

<script lang="ts">
import Tree from "../Tree/index.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { TreeNode } from "../../modules/tree";

@Component({
  name: "MoveExplorerSrc",
  components: {
    Tree,
  },
  apollo: {
    files: {
      query: FolderGQL,
      fetchPolicy: "network-only",
      variables() {
        return {
          path: this.selectedPath,
          limit: 100,
          cursor: "",
        };
      },
      result({ loading, data }) {
        if (!loading && data && !this.isLoadingMore) {
          const {
            files: { entries: listData },
          } = data;
          this.addNodes({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes: (listData as any[]).map<TreeNode>(entry => ({
              name: entry.name,
              id: entry.id,
              path: entry.path_lower,
              type: entry.tag,
              serverModified: entry.server_modified,
              size: entry.size,
              hash: entry.content_hash,
              children: [],
            })),
            toPath: this.selectedPath,
          });
        }
      },
    },
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Prop() path;
  @Prop() actionName;
  @Prop() skipQuery;

  @Getter("getNodesByPath") getNodesByPath: (path: string) => TreeNode[];

  selectedPath = this.path;

  @Action("moveResxSource") moveResxSource;
  @Action("addNodes") addNodes;

  onSelect(node) {
    this.moveResxSource(node.path);
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.moveResxSource(path);
  }

  handleFileSelected(event: Event, path: string) {
    this.moveResxSource(path);
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  padding: 0 0.5rem;
  width: 90%;
}
</style>
