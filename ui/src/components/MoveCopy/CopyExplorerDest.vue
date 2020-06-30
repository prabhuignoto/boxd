<template>
  <!-- <Treeview
    path
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerDest"
    hideFiles="true"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  /> -->
  <div class="tree-wrapper">
    <Tree v-on:selected="handleSelected" id="$root" />
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
  name: "CopyExplorerDest",
  components: {
    Tree,
  },
  apollo: {
    files: {
      query: FolderGQL,
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
  files = {
    entries: [],
  };

  @Prop() path;
  @Prop() actionName;
  selectedPath = this.path;

  @Getter("getBulkMode") getBulkMode;
  @Getter("getBulkItems") getBulkItems;

  @Action("copyResxDest") copyResxDest;
  @Action("setCopyResxBulk") setCopyResxBulk;
  @Action("updateDestForCopyResxBulk") updateDestForCopyResxBulk;
  @Action("addNodes") addNodes;

  onSelect(node) {
    this.copyResxDest(node.path);
    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(node.path);
    }
  }

  handleSubfolderSelection(path) {
    this.copyResxDest(path);
    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(path);
    }
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.copyResxDest(path);
    if (this.getBulkMode) {
      this.setCopyResxBulk(
        this.getBulkItems.map(item => ({
          fromPath: item.pathLower,
          id: item.id,
        }))
      );
      this.updateDestForCopyResxBulk(path);
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
