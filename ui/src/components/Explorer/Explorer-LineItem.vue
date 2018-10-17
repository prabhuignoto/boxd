<template>
  <div class="explorer-line-item">
    <div class="name explorer-cell">
      <span class="explorer-icon icon-folder" v-if="isFolder">
        <img src="../../assets/folder.svg" alt="folder"/>
      </span>
      <span class="explorer-icon icon-file" v-if="isFile">
        <img :src="getFileIcon" alt="file">
      </span>
      <span class="resource">
        <a href="" v-if="isFolder" class="folder-link" @click="handleNavigation(path_lower, $event)">{{name}}</a>
        <span v-else v-bind:title="name">{{name}}</span>
      </span>
    </div>
    <div class="size explorer-cell">{{sizeInMB}}</div>
    <div class="last-modified explorer-cell">{{serverModifiedFormatted}}</div>
    <div class="controls explorer-cell">
      <div class="popdown-container">
        <Popdown name="" type="icon" size="large" leftOffset="-4.5rem">
          <template slot="icon">
            <i>
              <img src="../../assets/ellipsis-h.svg" alt="more" />
            </i>
          </template>
          <template slot="menu">
            <ul class="options">
              <li class="option-item" v-if="isFile" @click="handleDownloadFile(path_lower)">
                <i>
                  <img src="../../assets/download.svg" alt="download">
                </i>
                <span>Download</span>
              </li>
              <li class="option-item" @click="handleCopy(path_lower)">
                <i><img src="../../assets/copy_flat.svg" alt="copy"></i>
                <span>Copy</span>
              </li>
              <li class="option-item" @click="handleMove(path_lower)">
                <i><img src="../../assets/copy_flat.svg" alt="move"></i>
                <span>Move</span>
              </li>
              <li class="option-item" @click="handleDelete(path_lower)">
                <i><img src="../../assets/cross_flat.svg" alt="delete"></i>
                <span>Delete</span>
              </li>
            </ul>
          </template>
        </Popdown>
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
    Popdown
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
      "deleteFolder",
      "updateModalState",
      "updatePath",
      "updateMoveCopyMode",
      "skipToFinal",
      "copyResxSource",
      "moveResxSource"
    ]),
    toggleImage(evt) {
      this.hideButtonImage = !this.hideButtonImage;
    },
    handleNavigation(path, $evt) {
      $evt.preventDefault();
      this.updatePath(path);
    },
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
          console.log(response);
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

<style lang="scss" scoped>
.explorer-line-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.2rem 1rem;

  .popdown-container {
    margin-left: auto;
    margin-right: 2rem;
  }
  .explorer-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &.name {
      text-align: left;
      flex: 2;
      font-size: 0.9rem;
      width: 100%;
      padding: 0 0.5rem;
    }
    &.size {
      flex: 1;
      text-align: left;
      font-size: 0.9rem;
      font-weight: 500;
    }
    &.last-modified {
      flex: 1;
      text-align: left;
      font-size: 0.9rem;
      font-weight: 500;
    }
    &.controls {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button {
      margin-right: 1rem;
      background: none;
      width: 2rem;
      height: 2rem;
      border-radius: 5px;
      cursor: pointer;
      outline: none;
      &:first-child {
        margin-left: auto;
      }
      &.delete-btn {
        border: 1px solid #ddd;
        &:hover {
          background: #ddd;
          cursor: pointer;
        }
      }
      &.download-btn {
        border: 1px solid #ddd;
        &:hover {
          background: #007ee5;
          cursor: pointer;
        }
      }
    }
    .explorer-icon {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      img {
        object-fit: contain;
        object-position: 50% 50%;
        height: 100%;
        width: 100%;
      }
    }

    .resource {
      margin-left: 0.5rem;
      font-weight: 500;
      max-width: 350px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .folder-link {
        color: #007ee5;
        font-weight: 500;
        text-decoration: none;
      }
    }
    .loader-wrapper {
      margin-left: auto;
      margin-right: 0.6rem;
    }
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
  }

  &:hover {
    background: rgba($color: #000000, $alpha: 0.04);
  }
}
</style>


