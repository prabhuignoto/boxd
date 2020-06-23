<template>
  <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="MoveExplorerSrc"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component("MoveExplorerSrc", {
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
    ...mapActions(["moveResxSource"]),
    onSelect(node) {
      this.moveResxSource(node.path);
    },
    handleSubfolderSelection(path) {
      this.moveResxSource(path);
    },
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      fetchPolicy: "network-only",
      variables() {
        return {
          path: this.path,
          limit: 1000,
          cursor: "",
        };
      },
    },
  },
});
</script>
