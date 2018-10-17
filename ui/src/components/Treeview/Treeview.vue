<template>
  <section class="tree file-tree">
    <div v-for="entry in entries" :key="entry.content_hash" class="node">
        <span v-if="entry.tag === 'file' && !hideFiles" class="node file-node">
          <img :src="getFileIcon(entry.path_lower)" alt="file" class="file-img">
          <span class="node-text" @click="selectFile({name: entry.name, path: entry.path_lower},  $event)" @blur="deselectFile" tabindex="0">{{entry.name}}</span>
        </span>
        <span v-if="entry.tag === 'folder'"
          class="node folder-node">
            <FolderView
              v-bind:name="entry.name"
              v-bind:entry="entry"
              v-bind:childTree="childTree"
              v-bind:handleSubfolderSelection="handleSubfolderSelection" />
        </span>
    </div>
  </section>
</template>

<script>

export default {
  name: "Treeview",
  props: ["path", "onSelect", "entries", "childTree", "handleSubfolderSelection", "hideFiles"],
  components: {
    FolderView: () => import("./FolderView"),
  },
  data() {
    return {
      showSubTree: false,
    };
  },
  methods: {
    handleOpenFolder(path) {
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
    }
  },
};
</script>

<style lang="scss" scoped>
.tree {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 4px;
  padding: 0.25rem;
  width: 300px;
  font-size: 0.95rem;

  .child-tree {
    padding-left: 1rem;
    display: block;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .folder-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .file-node {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-wrap: break-word;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 0.9rem;
    .node-text {
      height: 100%;
      width: 100%;
      padding: 0.25rem;
      text-align: left;
      max-width: 250px;
      text-transform: lowercase;
      &.selected {
        background: #007ee5;
        color: #fff;
        border-radius: 2px;
      }
    }
  }
  .file-img {
    height: 1.2rem;
    width: 1.2rem;
    margin-right: 0.25rem;
    margin-top: 0.25rem;
  }

}
</style>

