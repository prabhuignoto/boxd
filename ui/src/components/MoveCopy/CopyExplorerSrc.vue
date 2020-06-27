<template>
  <Treeview
    path=""
    v-bind:onSelect="onSelect"
    v-bind:entries="files.entries"
    childTree="CopyExplorerSrc"
    v-bind:handleSubfolderSelection="handleSubfolderSelection"
  />
</template>

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";
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
      query: FolderGQL,
      fetchPolicy: "network-only",
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
