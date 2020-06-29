<template>
  <!-- <Treeview
    path
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
    childTree="MoveExplorerDest"
    skipQuery="true"
  /> -->
  <Tree />
</template>

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Tree from "../Tree/index.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { TreeNode } from "../../modules/tree";
import { Dispatch } from "vuex";

@Component({
  name: "MoveExplorerSrc",
  components: {
    Treeview,
    Tree,
  },
  watch: {
    getNodesByPath(newVal) {
      console.log(newVal);
    },
  },
  apollo: {
    files: {
      query: FolderGQL,
      fetchPolicy: "network-only",
      skip() {
        debugger;
        return !!this.skipQuery;
      },
      variables() {
        return {
          path: this.path,
          limit: 1000,
          cursor: "",
        };
      },
      result({ loading, data: { files } }) {
        if (!loading) {
          debugger;
          this.addNodes({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            nodes: (files.entries as any[]).map<TreeNode>(entry => ({
              name: entry.name,
              id: entry.id,
              path: entry.path_lower,
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

  @Getter("getNodesByPath") getNodesByPath: (path: string) => Dispatch;

  selectedPath = this.path;

  @Action("moveResxSource") moveResxSource;
  @Action("addNodes") addNodes;

  onSelect(node) {
    this.moveResxSource(node.path);
  }

  handleSubfolderSelection(path) {
    this.selectedPath = path;
    this.$apollo.queries.files.refresh();
    this.moveResxSource(path);
  }

  mounted() {
    this.getNodesByPath("/");
  }
}
</script>
