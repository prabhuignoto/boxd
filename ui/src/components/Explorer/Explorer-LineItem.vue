<template>
  <div class="explorer-line-item" :class="{ disabled: bulk_op_in_progress }">
    <div
      class="explorer-line-item-check"
      @click="handleCheck()"
      :class="{ selected: selected }"
    >
      <SquareIcon v-if="!selected && !bulk_op_in_progress" />
      <CheckSquareIcon v-if="selected && !bulk_op_in_progress" />
    </div>
    <div class="name explorer-cell">
      <span class="explorer-icon icon-folder" v-if="isFolder">
        <img src="../../assets/folder.svg" alt="folder" />
      </span>
      <span class="explorer-icon icon-file" v-if="isFile">
        <img :src="getFileIcon" alt="file" />
      </span>
      <span class="resource">
        <a
          href="javascript:void(0);"
          v-if="isFolder"
          class="folder-link"
          @click="handleNavigation(path_lower, $event)"
          >{{ name }}</a
        >
        <a
          href="javascript:void(0);"
          v-if="isFile"
          class="file-link"
          @click="handleFile(path_lower)"
          >{{ name }}</a
        >
      </span>
    </div>
    <div class="size explorer-cell">{{ prettySize }}</div>
    <div class="last-modified explorer-cell">{{ serverModifiedFormatted }}</div>
    <div class="controls explorer-cell">
      <div class="popdown-container" v-if="!bulk_op_in_progress">
        <LineItemPopdown :isFile="isFile" :pathLower="path_lower" />
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { mapActions } from "vuex";
import LineItemPopdown from "./line-item-popdown";
import PrettyBytes from "pretty-bytes";
import { SquareIcon, CheckSquareIcon } from "vue-feather-icons";

export default {
  name: "ExplorerLineItem",
  props: [
    "name",
    "size",
    "contentHash",
    "tag",
    "server_modified",
    "path_lower",
    "bulk_op_in_progress",
  ],
  components: {
    LineItemPopdown,
    SquareIcon,
    CheckSquareIcon,
  },
  computed: {
    isFolder() {
      return this.tag === "folder";
    },
    isFile() {
      return this.tag === "file";
    },
    prettySize() {
      return this.size ? PrettyBytes(this.size) : "";
    },
    serverModifiedFormatted() {
      return this.server_modified
        ? DateTime.fromISO(this.server_modified).toLocaleString(
            DateTime.DATETIME_MED
          )
        : "";
    },
    getFileIcon() {
      const parts = this.path_lower.split("/");
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
  data() {
    return {
      hideButtonImage: false,
      isDownloadingFile: false,
      selected: false,
    };
  },
  methods: {
    ...mapActions([
      "updatePath",
      "updateFilePath",
      "updateFileStatus",
      "updateFileName",
      "updateFileSize",
      "updateFileModified",
      "clearList",
      "clearAllBulk",
    ]),
    toggleImage() {
      this.hideButtonImage = !this.hideButtonImage;
    },
    handleNavigation(path, $evt) {
      $evt.preventDefault();
      this.clearAllBulk();
      this.clearList();
      this.updatePath(path);
    },
    handleFile(path) {
      const files = path.split("/");
      const fileName = files[files.length - 1];
      this.updateFileName(fileName);
      this.updateFilePath(path);
      this.updateFileSize(this.sizeInMB);
      this.updateFileModified(this.serverModifiedFormatted);
      this.updateFileStatus("open");
    },
    handleCheck() {
      this.selected = !this.selected;

      if (this.selected) {
        this.$emit("selected", {
          name: this.name,
          content_hash: this.content_hash,
          path_lower: this.path_lower,
        });
      } else {
        this.$emit("deselected", {
          name: this.name,
          content_hash: this.content_hash,
          path_lower: this.path_lower,
        });
      }
    },
  },
};
</script>

<style lang="scss" src="./explorer-lineitem.scss" scoped />
