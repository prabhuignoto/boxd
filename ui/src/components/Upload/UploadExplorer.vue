<template>
  <section>
    <Treeview path="" 
      v-bind:onSelect="onSelect"
      v-bind:entries="files"
      childTree="UploadExplorer"
      hideFiles="true"
      v-bind:handleSubfolderSelection="handleSubfolderSelection"/>
  </section>
</template>

<script>
import Treeview from "../Treeview/Treeview";
import Vue from "vue";
import gql from "graphql-tag";
import FolderGQL from "../../graphql/folder.gql";
import { mapActions, mapGetters } from "vuex";

export default Vue.component("UploadExplorer", {
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
  props: ["path"],
  methods: {
    ...mapActions(["createFolderSelection", "uploadFile"]),
    onSelect(node) {},
    handleSubfolderSelection(path) {
      this.uploadFile(path);
    }
  },
  computed: {
    ...mapGetters(["getUploadPath"])
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        };
      },
      update(data) {
        return data.files.entries;
      }
    }
  }
});
</script>