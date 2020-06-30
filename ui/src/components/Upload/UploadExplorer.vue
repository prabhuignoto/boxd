<template>
  <div class="tree-wrapper">
    <Tree v-on:selected="handleSelected" id="$root" />
  </div>
</template>

<script lang="ts">
// import Treeview from "../Treeview/Treeview.vue";
import Tree from "../Tree/index.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { TreeNode } from "../../modules/tree";

@Component({
  name: "UploadExplorer",
  components: {
    Tree,
  },
  apollo: {
    files: {
      query: FolderGQL,
      variables() {
        return {
          path: this.selectedPath,
          limit: 1000,
          cursor: "",
        };
      },
      update(data) {
        return data.files.entries;
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

  @Prop() path: string;

  @Action("createFolderSelection") createFolderSelection;
  @Action("uploadFile") uploadFile;
  @Getter("getUploadPath") getUploadPath;
  @Action("addNodes") addNodes;

  selectedPath = this.path;

  handleSubfolderSelection(path): void {
    this.uploadFile(path);
  }

  handleSelected(event: Event, path: string) {
    this.selectedPath = path;
    this.uploadFile(path);
  }
}
</script>

<style lang="scss" scoped>
.tree-wrapper {
  padding: 0 0.5rem;
  width: 90%;
}
</style>
