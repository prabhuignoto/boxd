<template>
  <section>
    <Treeview
      path=""
      v-bind:entries="files"
      childTree="UploadExplorer"
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
import { Action, Getter } from "vuex-class";

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

  @Prop() path: string;
  @Action("createFolderSelection") createFolderSelection;
  @Action("uploadFile") uploadFile;
  @Getter("getUploadPath") getUploadPath;

  handleSubfolderSelection(path): void {
    this.uploadFile(path);
  }
}
</script>
