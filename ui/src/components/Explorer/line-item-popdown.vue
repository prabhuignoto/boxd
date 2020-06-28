<template>
  <Popdown
    name
    type="icon"
    size="medium"
    position="right"
    customWidth="150"
    topOffset="2.5rem"
  >
    <template slot="icon">
      <i>
        <MoreHorizontalIcon color="#007ee5" />
      </i>
    </template>
    <template slot="menu">
      <ul class="options">
        <li
          class="option-item"
          v-if="isFile"
          @click="handleDownloadFile(pathLower)"
        >
          <span>Download</span>
        </li>
        <li class="option-item" @click="handleCopy(pathLower)">
          <span>Copy</span>
        </li>
        <li class="option-item" @click="handleMove(pathLower)">
          <span>Move</span>
        </li>
        <li class="option-item" @click="handleDelete(pathLower)">
          <span>Delete</span>
        </li>
      </ul>
    </template>
  </Popdown>
</template>

<script>
import Popdown from "../Popdown/index";
import Axios from "axios";
import FileSaver from "filesaver.js";
import { MoreHorizontalIcon } from "vue-feather-icons";
import { getFileName } from "../../utils";
import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import Vue from "vue";

@Component({
  name: "LineItemPopdown",
  components: {
    Popdown,
    MoreHorizontalIcon,
  },
})
export default class extends Vue {
  @Prop() isFile;
  @Prop() pathLower;
  path = "";

  @Action("deleteFolder") deleteFolder;
  @Action("updateModalState") updateModalState;
  @Action("updatePath") updatePath;
  @Action("updateMoveCopyMode") updateMoveCopyMode;
  @Action("skipToFinal") skipToFinal;
  @Action("copyResxSource") copyResxSource;
  @Action("moveResxSource") moveResxSource;

  get fileName() {
    return getFileName(this.path);
  }

  handleDelete(path) {
    this.path = path;
    this.deleteFolder(path);
    this.updateModalState({
      status: true,
      componentToRender: "DeleteFolder",
      title: `Delete ${this.fileName}`,
      width: 450,
    });
  }

  handleCopy(path) {
    this.path = path;
    // set the operation mode
    this.updateMoveCopyMode("copy");
    // skip to the final step
    this.skipToFinal(true);
    this.copyResxSource(path);
    this.updateModalState({
      status: true,
      title: `Copy ${this.fileName}`,
      componentToRender: "MoveCopy",
      width: 500,
    });
  }

  handleMove(path) {
    this.path = path;
    // set the operation Mode
    this.updateMoveCopyMode("move");
    // skip to the final step
    this.skipToFinal(true);
    this.moveResxSource(path);
    // open the modal
    this.updateModalState({
      status: true,
      title: `Move ${this.fileName}`,
      componentToRender: "MoveCopy",
      width: 500,
    });
  }

  handleDownloadFile(path) {
    this.isDownloadingFile = true;
    Axios({
      url: `${process.env.VUE_APP_API_SERVER}/download`,
      params: {
        path,
      },
      withCredentials: true,
      responseType: "blob",
    })
      .then(response => {
        const blob = new Blob([response.data], {
          type: `${response.headers["content-type"]};charset=utf-8`,
        });
        FileSaver.saveAs(blob, path.replace("/", ""));
        this.isDownloadingFile = false;
      })
      .catch(error => {
        console.log(error);
        this.isDownloadingFile = false;
      });
  }
}
</script>

<style lang="scss" src="./line-item-popdown.scss" scoped />
