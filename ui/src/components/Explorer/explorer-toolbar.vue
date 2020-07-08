<template>
  <nav class="explorer-toolbar-wrapper">
    <ul class="explorer-toolbar">
      <li class="explorer-toolbar-item context" title="Quick Actions">
        <ContextControl :path="getExplorerPath" type="link" name="Random" />
      </li>
      <li
        class="explorer-toolbar-item download"
        title="Download Selected"
        v-if="getActiveBulkRecords.length"
        @click="handleBulkDownload"
      >
        <i>
          <DownloadIcon />
        </i>
      </li>
      <li
        class="explorer-toolbar-item copy"
        title="Copy Selected"
        v-if="getActiveBulkRecords.length"
        @click="handleBulkCopy"
      >
        <i>
          <CopyIcon />
        </i>
      </li>
      <li
        class="explorer-toolbar-item move"
        title="Move Selected"
        v-if="getActiveBulkRecords.length"
        @click="handleBulkMove"
      >
        <i>
          <ArrowRightIcon />
        </i>
      </li>
      <li
        class="explorer-toolbar-item trash"
        title="Delete Selected"
        @click="handleBulkDelete"
        v-if="getActiveBulkRecords.length"
      >
        <i>
          <TrashIcon />
        </i>
      </li>
    </ul>
  </nav>
</template>

<script>
import Vue from "vue";
import {
  TrashIcon,
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
} from "vue-feather-icons";

import ContextControl from "../ContextActions/Control.vue";
import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "ExplorerToolbar",
  components: {
    TrashIcon,
    ArrowRightIcon,
    CopyIcon,
    ContextControl,
    DownloadIcon,
  },
})
export default class extends Vue {
  @Action("enableBulkMode") enableBulkMode;
  @Action("skipToFinal") skipToFinal;
  @Action("updateModalState") updateModalState;
  @Action("setMoveResxBulk") setMoveResxBulk;
  @Action("updateMoveCopyMode") updateMoveCopyMode;
  @Action("addJob") addJob;

  @Getter("getActiveBulkRecords") getActiveBulkRecords;
  @Getter("getExplorerPath") getExplorerPath;

  handleBulkDelete() {
    this.addJob({
      jobType: "DELETE",
      data: {
        items: this.getActiveBulkRecords,
        treeId: "explorer-main",
      },
    });
  }

  handleBulkCopy() {
    this.updateMoveCopyMode("copy");
    this.enableBulkMode(true);

    this.skipToFinal(true);
    this.updateModalState({
      status: true,
      componentToRender: "MoveCopy",
      title: `Copying files`,
      width: 550,
    });
  }

  handleBulkMove() {
    this.updateMoveCopyMode("move");
    this.enableBulkMode(true);

    this.skipToFinal(true);
    this.updateModalState({
      status: true,
      componentToRender: "MoveCopy",
      title: `Moving files`,
      width: 550,
    });
  }

  handleBulkDownload() {
    this.addJob({
      jobType: "DOWNLOAD",
      data: {
        items: this.getActiveBulkRecords,
        treeId: "explorer-main",
      },
    });
  }
}
</script>

<style lang="scss" src="./explorer-toolbar.scss" scoped />
