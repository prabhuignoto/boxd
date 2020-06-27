<template>
  <section class="tree file-tree">
    <div v-for="entry in entries" :key="entry.content_hash" class="node">
      <span v-if="entry.tag === 'file' && !hideFiles" class="node file-node">
        <img :src="getFileIcon(entry.path_lower)" alt="file" class="file-img" />
        <span
          class="node-text"
          @click="
            selectFile({ name: entry.name, path: entry.path_lower }, $event)
          "
          @blur="deselectFile"
          tabindex="0"
          >{{ entry.name }}</span
        >
      </span>
      <span v-if="entry.tag === 'folder'" class="node folder-node">
        <FolderView
          v-bind:name="entry.name"
          v-bind:entry="entry"
          v-bind:childTree="childTree"
          v-bind:handleSubfolderSelection="handleSubfolderSelection"
        />
      </span>
    </div>
  </section>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "Treeview",
  props: [
    "path",
    "onSelect",
    "entries",
    "childTree",
    "handleSubfolderSelection",
    "hideFiles",
  ],
  components: {
    FolderView: () => import("./FolderView"),
  },
  data() {
    return {
      showSubTree: false,
    };
  },
  methods: {
    handleOpenFolder() {
      this.showSubTree = !this.showSubTree;
    },
    selectFile(node, $evt) {
      $evt.target.classList.add("selected");
      this.onSelect(node);
    },
    deselectFile(evt) {
      evt.target.classList.remove("selected");
    },
    getFileIcon(path) {
      const parts = path.split("/");
      const fileName = parts[parts.length - 1];
      const fileNameParts = fileName.split(".");
      const ext = fileNameParts[fileNameParts.length - 1];
      const images = require.context("../../assets", false, /\.svg$/);

      switch (ext) {
        case "pdf":
          return images("./pdf.svg");
        case "ppt":
          return images("./ppt.svg");
        case "jpg":
          return images("./jpg.svg");
        case "png":
          return images("./png.svg");
        case "xls":
          return images("./xls.svg");
        case "doc":
          return images("./doc.svg");
        case "txt":
          return images("./txt.svg");
        default:
          return images("./file.svg");
      }
    },
  },
});
</script>

<style lang="scss" src="./treeview.scss" scoped />
