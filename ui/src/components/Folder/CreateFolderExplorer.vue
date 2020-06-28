<template>
  <section>
    <Treeview
      path=""
      v-bind:entries="files"
      childTree="CreateFolderExplorer"
      hideFiles="true"
      v-bind:handleSubfolderSelection="handleSubfolderSelection"
    />
  </section>
</template>

<script lang="ts">
import Treeview from "../Treeview/Treeview.vue";
import Vue from "vue";
import FolderGQL from "../../graphql/folder";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  components: {
    Treeview,
  },
  apollo: {
    files: {
      query: FolderGQL,
      variables() {
        return {
          path: this.path,
          limit: 1000,
          cursor: "",
        };
      },
      update(data) {
        return data.files.entries;
      },
    },
  },
})
export default class extends Vue {
  files = {
    entries: [],
  };

  @Prop() path;
  @Action("createFolderSelection") createFolderSelection;

  handleSubfolderSelection(path) {
    this.createFolderSelection(path);
  }
}
</script>
