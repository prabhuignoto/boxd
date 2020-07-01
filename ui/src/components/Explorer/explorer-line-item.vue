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
          @click="handleNavigation(path, $event)"
          >{{ name }}</a
        >
        <a
          href="javascript:void(0);"
          v-if="isFile"
          class="file-link"
          @click="handleFile(path)"
          >{{ name }}</a
        >
      </span>
    </div>
    <div class="size explorer-cell">{{ prettySize }}</div>
    <div class="last-modified explorer-cell">{{ serverModifiedFormatted }}</div>
    <div class="controls explorer-cell">
      <div class="popdown-container" v-if="!locked">
        <LineItemPopdown :isFile="isFile" :pathLower="path" />
      </div>
      <div v-if="locked" class="status-label">
        <Loader type="throb" :message="getStatusLabel" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DateTime } from "luxon";
import LineItemPopdown from "./line-item-popdown.vue";
import PrettyBytes from "pretty-bytes";
import {
  SquareIcon,
  CheckSquareIcon,
  LockIcon,
  FolderIcon,
  FileIcon,
} from "vue-feather-icons";
import Loader from "../Loader.vue";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import Vue from "vue";
import { JobType } from "../../modules/jobs";

@Component({
  name: "ExplorerLineItem",
  components: {
    LineItemPopdown,
    SquareIcon,
    CheckSquareIcon,
    LockIcon,
    FolderIcon,
    FileIcon,
    Loader,
  },
})
export default class extends Vue {
  @Prop() name;
  @Prop() size;
  @Prop() hash;
  @Prop() type;
  @Prop() serverModified;
  @Prop() path;
  @Prop() id;
  @Prop() locked;
  @Prop() lockType;
  @Prop() showSelected;

  hideButtonImage = false;
  isDownloadingFile = false;
  selected = this.showSelected;

  @Action("updatePath") updatePath;
  @Action("updateFilePath") updateFilePath;
  @Action("updateFileStatus") updateFileStatus;
  @Action("updateFileName") updateFileName;
  @Action("updateFileSize") updateFileSize;
  @Action("updateFileModified") updateFileModified;
  @Action("clearList") clearList;
  @Action("clearAllBulk") clearAllBulk;
  @Action("addJob") addJob;

  get getStatusLabel() {
    if (this.lockType === "MOVE") {
      return "moving...";
    } else if (this.lockType === "COPY") {
      return "copying ...";
    } else if (this.lockType === "DELETE") {
      return "deleting ...";
    }
    return "";
  }

  get isFolder() {
    return this.type === "folder";
  }

  get isFile() {
    return this.type === "file";
  }

  get prettySize() {
    return this.size ? PrettyBytes(this.size) : "";
  }

  get serverModifiedFormatted() {
    return this.serverModified
      ? DateTime.fromISO(this.serverModified).toLocaleString(
          DateTime.DATETIME_MED
        )
      : "";
  }

  toggleImage() {
    this.hideButtonImage = !this.hideButtonImage;
  }

  handleNavigation(path, $evt) {
    $evt.preventDefault();
    this.clearAllBulk();
    this.clearList();
    this.updatePath(path);

    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
      },
    });
  }

  handleFile(path) {
    const files = path.split("/");
    const fileName = files[files.length - 1];
    this.updateFileName(fileName);
    this.updateFilePath(path);
    this.updateFileSize(this.size);
    this.updateFileModified(this.serverModifiedFormatted);
    this.updateFileStatus("open");
  }

  handleCheck() {
    this.selected = !this.selected;

    if (this.selected) {
      this.$emit("selected", {
        name: this.name,
        contentHash: this.hash,
        pathLower: this.path,
        id: this.id,
      });
    } else {
      this.$emit("deselected", {
        name: this.name,
        contentHash: this.hash,
        pathLower: this.path,
        id: this.id,
      });
    }
  }

  mounted() {
    this.$watch("showSelected", function (newVal) {
      this.selected = newVal;
    });
  }
}
</script>

<style lang="scss" src="./explorer-line-item.scss" scoped />
