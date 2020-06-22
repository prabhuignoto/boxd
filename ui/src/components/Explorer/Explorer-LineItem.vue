<template>
  <div class="explorer-line-item" :class="{ locked: locked }">
    <div
      class="explorer-line-item-check"
      @click="handleCheck()"
      :class="{ selected: selected, locked: locked }"
    >
      <SquareIcon v-if="!selected && !locked" />
      <CheckSquareIcon v-if="selected && !locked" />
      <LockIcon v-if="locked" />
    </div>
    <div class="name explorer-cell">
      <span class="explorer-icon icon-folder" v-if="isFolder">
        <FolderIcon />
      </span>
      <span class="explorer-icon icon-file" v-if="isFile">
        <FileIcon />
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
      <div class="popdown-container" v-if="!locked">
        <LineItemPopdown :isFile="isFile" :pathLower="path_lower" />
      </div>
      <span v-if="locked" class="status-label">{{ getStatusLabel }}</span>
    </div>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { mapActions } from "vuex";
import LineItemPopdown from "./line-item-popdown";
import PrettyBytes from "pretty-bytes";
import {
  SquareIcon,
  CheckSquareIcon,
  LockIcon,
  FolderIcon,
  FileIcon,
} from "vue-feather-icons";

export default {
  name: "ExplorerLineItem",
  props: [
    "name",
    "size",
    "contentHash",
    "tag",
    "server_modified",
    "path_lower",
    "id",
    "locked",
    "lockType",
  ],
  components: {
    LineItemPopdown,
    SquareIcon,
    CheckSquareIcon,
    LockIcon,
    FolderIcon,
    FileIcon,
  },
  computed: {
    getStatusLabel() {
      if (this.lockType === "MOVE") {
        return "moving...";
      } else if (this.lockType === "COPY") {
        return "copying ...";
      } else if (this.lockType === "DELETE") {
        return "deleting ...";
      }
      return "";
    },
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
          id: this.id,
        });
      } else {
        this.$emit("deselected", {
          name: this.name,
          content_hash: this.content_hash,
          path_lower: this.path_lower,
          id: this.id,
        });
      }
    },
  },
};
</script>

<style lang="scss" src="./explorer-lineitem.scss" scoped />
