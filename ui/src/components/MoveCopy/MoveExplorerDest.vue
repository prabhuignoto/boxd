<template>
  <div class="tree-wrapper">
    <Tree v-on:selected="handleSelected" id="$root" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import Tree from "../Tree/index.vue";
import { TreeNode } from "../../modules/tree";

@Component({
  name: "MoveExplorerDest",
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
          cursor: "",
          limit: 1000,
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
  @Prop() path;
  @Prop() actionName;

  selectedPath = this.path;
  files = {
    entries: [],
  };

  @Getter("getBulkMode") getBulkMode;
  @Getter("getBulkItems") getBulkItems;

  @Action("moveResxDest") moveResxDest;
  @Action("updateDestForMoveResxBulk") updateDestForMoveResxBulk;
  @Action("setMoveResxBulk") setMoveResxBulk;
  @Action("addNodes") addNodes;

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;

    this.moveResxDest(path);
    if (this.getBulkMode) {
      this.setMoveResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForMoveResxBulk(path);
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  padding: 0 0.5rem;
  width: 90%;
}
</style>