<template>
  <Treeview path="" 
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="MoveExplorerDest"
    hideFiles="true"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"/>
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component("MoveExplorerDest", {
  components: {
    Treeview
  },
  data() {
    return {
      files: {
        entries: []
      }
    };
  },
  props: ["path", "actionName"],
  methods: {
    ...mapActions(["moveResxDest"]),
    onSelect(node) {
      this.moveResxDest(node.path);
    },
    handleSubfolderSelection(path) {
      this.moveResxDest(path);
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        };
      }
    }
  }
});
</script>