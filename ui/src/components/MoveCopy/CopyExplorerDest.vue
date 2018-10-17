<template>
  <Treeview path="" 
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerDest"
    hideFiles="true"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"/>
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component('CopyExplorerDest', {
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
  props: ["path", "actionName"],
  methods: {
    ...mapActions(["copyResxDest"]),
    onSelect(node) {
      this.copyResxDest(node.path);
    },
    handleSubfolderSelection(path) {
      this.copyResxDest(path);
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  test {
    color: red;
  }
</style>
