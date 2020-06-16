<template>
  <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerSrc"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component("CopyExplorerSrc", {
  components: {
    Treeview,
  },
  data() {
    return {
      files: {
        entries: [],
      },
    };
  },
  props: ["path", "actionName"],
  methods: {
    ...mapActions(["copyResxSource"]),
    onSelect(node) {
      this.copyResxSource(node.path);
    },
    handleSubfolderSelection(path) {
      this.copyResxSource(path);
    },
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path,
          cursor: "",
          limit: 1000,
        };
      },
    },
  },
});
</script>
