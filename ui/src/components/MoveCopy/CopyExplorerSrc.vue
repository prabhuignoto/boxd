<template>
  <!-- <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerSrc"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  /> -->
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
import { Action } from "vuex-class";

@Component({
  name: "CopyExplorerSrc",
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
  files = {
    entries: [],
  };

  @Prop() path;
  @Action("copyResxSource") copyResxSource;
  @Action("addNodes") addNodes;

  selectedPath = this.path;

  onSelect(node) {
    this.copyResxSource(node.path);
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.copyResxSource(path);
  }

  handleFileSelected(event: Event, path: string) {
    this.copyResxSource(path);
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  padding: 0 0.5rem;
  width: 90%;
}
</style>
