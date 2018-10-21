<template>
  <Treeview path="" 
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="FileExplorer"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"/>
</template>

<script>
import Treeview from "./Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component('FileExplorer', {
  components: {
    Treeview
  },
  data() {
    return {
      files: {
        entries: [],
      }
    }
  },
  props: ["path"],
  methods: {
    onSelect(node) {
      this.$store.dispatch("updateExplorerNode", node);
    },
    handleSubfolderSelection(path) {
      this.$store.dispatch("updatePath", path);
    },
    ...mapActions(["updateTreeViewData"]),
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        }
      },
      result({loading, data}) {
        if(!loading && data.files && data.files.entries) {
          // console.log(data.files.entries)
          // this.updateTreeViewData(data.files.entries);
        }
      }
    }
  }
})
</script>