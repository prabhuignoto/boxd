<template>
  <div class="explorer-line-item">
    <div class="explorer-cee"></div>
    <div class="name explorer-cell">
      <span class="explorer-icon icon-folder" v-if="isFolder">
        <img src="../../assets/folder.svg" alt="folder"/>
      </span>
      <span class="explorer-icon icon-file" v-if="isFile">
        <img :src="getFileIcon" alt="file">
      </span>
      <span class="resource">
        <a href="javascript:void(0);" v-if="isFolder" class="folder-link" @click="handleNavigation(path_lower, $event)">{{name}}</a>
        <a href="javascript:void(0);" v-if="isFile" class="file-link" @click="handleFile(path_lower)">{{name}}</a>
        <!-- <span v-else v-bind:title="name">{{name}}</span> -->
      </span>
    </div>
    <div class="size explorer-cell">{{sizeInMB}}</div>
    <div class="last-modified explorer-cell">{{serverModifiedFormatted}}</div>
    <div class="controls explorer-cell">
      <div class="popdown-container">
        <LineItemPopdown :isFile="isFile" :pathLower="path_lower"/>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { mapActions } from "vuex";
import Axios from "axios";
import FileSaver from "filesaver.js";
import Loader from "../Loader";
import Popdown from "../Popdown/index.vue";
import LineItemPopdown from "./line-item-popdown";

export default {
  name: "ExplorerLineItem",
  props: [
    "name",
    "size",
    "contentHash",
    "tag",
    "server_modified",
    "path_lower"
  ],
  components: {
    Loader,
    Popdown,
    LineItemPopdown
  },
  computed: {
    isFolder() {
      return this.tag === "folder";
    },
    isFile() {
      return this.tag === "file";
    },
    sizeInMB() {
      return this.size
        ? `${
            this.size && this.size < 1048576
              ? Number(this.size * 0.00098).toFixed(2) + " kb"
              : Number(this.size * 0.000001).toFixed(1) + " mb"
          }`
        : "";
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
    }
  },
  data() {
    return {
      hideButtonImage: false,
      isDownloadingFile: false
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
      "clearList"
    ]),
    toggleImage(evt) {
      this.hideButtonImage = !this.hideButtonImage;
    },
    handleNavigation(path, $evt) {
      $evt.preventDefault();
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
    }
  }
};
</script>

<style lang="scss" src="./explorer-lineitem.scss" />


