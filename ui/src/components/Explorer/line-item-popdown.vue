<template>
  <Popdown name="" type="icon" size="medium" leftOffset="-3.75rem" customWidth="150px" topOffset="2.5rem">
    <template slot="icon">
      <i>
        <img src="../../assets/ellipsis-h.svg" alt="more" />
      </i>
    </template>
    <template slot="menu">
      <ul class="options">
        <li class="option-item" v-if="isFile" @click="handleDownloadFile(pathLower)">
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
import { mapActions } from "vuex";
import Axios from "axios";
import FileSaver from "filesaver.js";

export default {
  name: "LineItemPopdown",
  components: {
    Popdown
  },
  props: ["isFile", "pathLower"],
  methods: {
    ...mapActions([
      "deleteFolder",
      "updateModalState",
      "updatePath",
      "updateMoveCopyMode",
      "skipToFinal",
      "copyResxSource",
      "moveResxSource",
    ]),
    handleDelete(path) {
      this.deleteFolder(path);
      this.updateModalState({
        status: true,
        componentToRender: "DeleteFolder",
        title: "Delete Resource"
      });
    },
    handleCopy(path) {
      // set the operation mode
      this.updateMoveCopyMode("copy");
      // skip to the final step
      this.skipToFinal(true);
      this.copyResxSource(path);
      this.updateModalState({
        status: true,
        title: "Copy",
        componentToRender: "MoveCopy"
      });
    },
    handleMove(path) {
      // set the operation Mode
      this.updateMoveCopyMode("move");
      // skip to the final step
      this.skipToFinal(true);
      this.moveResxSource(path);
      // open the modal
      this.updateModalState({
        status: true,
        title: "Move",
        componentToRender: "MoveCopy"
      });
    },
    handleDownloadFile(path) {
      this.isDownloadingFile = true;
      Axios({
        url: "http://localhost:4000/download",
        params: {
          path
        },
        withCredentials: true,
        responseType: "blob"
      })
        .then(response => {
          var blob = new Blob([response.data], {
            type: response.headers["content-type"]
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
};
</script>

<style lang="scss" src="./line-item-popdown.scss" />
