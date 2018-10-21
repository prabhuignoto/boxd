<template>
  <section>
    <Treeview path="" 
      v-bind:onSelect="onSelect"
      v-bind:entries="files"
      childTree="CreateFolderExplorer"
      hideFiles="true"
      v-bind:handleSubfolderSelection="handleSubfolderSelection"/>
  </section>
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions } from "vuex";

export default Vue.component('CreateFolderExplorer', {
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
    ...mapActions(["createFolderSelection"]),
    onSelect(node) {
    },
    handleSubfolderSelection(path) {
      this.createFolderSelection(path);
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        }
      },
      update(data) {
        return data.files.entries;
      }
    }
  }
})
</script>