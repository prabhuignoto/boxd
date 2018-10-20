<template>
  <Popdown name="" type="icon" size="large" leftOffset="-3rem" customWidth="130px">
    <template slot="icon">
      <i>
        <img src="../../assets/ellipsis-h.svg" alt="more" />
      </i>
    </template>
    <template slot="menu">
      <ul class="options">
        <li class="option-item" v-if="isFile" @click="handleDownloadFile(pathLower)">
          <i>
            <img src="../../assets/download.svg" alt="download">
          </i>
          <span>Download</span>
        </li>
        <li class="option-item" @click="handleCopy(pathLower)">
          <i><img src="../../assets/copy_flat.svg" alt="copy"></i>
          <span>Copy</span>
        </li>
        <li class="option-item" @click="handleMove(pathLower)">
          <i><img src="../../assets/copy_flat.svg" alt="move"></i>
          <span>Move</span>
        </li>
        <li class="option-item" @click="handleDelete(pathLower)">
          <i><img src="../../assets/cross_flat.svg" alt="delete"></i>
          <span>Delete</span>
        </li>
      </ul>
    </template>
  </Popdown>
</template>

<script>
import Popdown from "../Popdown/index";
import { mapActions } from "vuex";

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
      "moveResxSource"
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
        Title: "Copy",
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
        Title: "Move",
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

<style lang="scss">
.options {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  list-style: none;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 0.9rem;

  li {
    width: 100%;
    padding: 0.75rem 0rem;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:first-child {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    &:last-child {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    &:hover {
      background: rgba(0, 126, 229, 0.2);
    }
    i {
      width: 1.75rem;
      height: 1.75rem;
      display: block;
      margin-left: 0.5rem;
      margin-right: 0.75rem;

      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
}
</style>
