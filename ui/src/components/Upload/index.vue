<template>
  <section class="upload-main">
    <section class="upload-wrapper">
      <div :class="setClass" 
        @drop="handleDrop" @dragover="handleDragOver"
        @drag="handleDrag" @dragstart="handleDragStart"
        @dragend="handleDragEnd" @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <span class="intro-message" v-if="!isDropped">Drop your file</span>
        <div v-if="isDropped" class="dropped-file" :style="getResultStyle">
          <i class="icon-wrapper">
            <img src="../../assets/file.svg" alt="file">
          </i>
          <span class="file-name">{{fileName}}</span>
          <!-- <span class="success-msg" v-if="uploadSuccess">File uploaded successfully.</span> -->
          <div class="progress-wrap" v-if="uploadStarted">
            <ProgressBar :value="progress" />
          </div>
        </div>
        <div class="clear-upload" v-if="isDropped">
          <Button buttonStyle="icon" :onClick="handleClear" v-if="!uploadSuccess">
            <template slot="btn-icon">
              <img src="../../assets/times.svg" alt="clear-upload">
            </template>
          </Button>
        </div>
      </div>
      <div class="explorer-wrapper">
        <UploadExplorer path="" />
      </div>
    </section>
    <div class="upload-controls">
      <Button name="Upload" :onClick="handleUpload" :disabled="!isDropped || uploadStarted" :buttonStyle="getStyle">
        <template slot="btn-icon">
          <img src="../../assets/check.svg" alt="upload">
        </template>
      </Button>
      <Button name="Close" :onClick="handleCancel">
        <template slot="btn-icon">
          <img src="../../assets/times.svg" alt="cancel upload">
        </template>
      </Button>
    </div>
  </section>
</template>

<script>
import Button from "../Form/Button";
import UploadExplorer from "./UploadExplorer";
import Vue from "vue";
import { mapActions } from "vuex";
import Axios from "axios";
import ProgressBar from "../Progressbar";

export default Vue.component("UploadWindow", {
  components: {
    Button,
    ProgressBar
  },
  computed: {
    setClass() {
      return {
        "drop-zone": true,
        "drag-over": this.isDragOver,
        dropped: this.isDropped
      };
    },
    getStyle() {
      return !this.isDropped || this.uploadStarted ? "disabled" : "";
    },
    getResultStyle() {
      if (this.uploadSuccess === true) {
        return {
          background: "green",
          color: "#fff"
        };
      } else if (this.uploadSuccess === false) {
        return {
          background: "#cb2431",
          color: "#fff"
        };
      }
    }
  },
  data() {
    return {
      isDragOver: false,
      isDropped: false,
      fileName: "",
      fileSize: 0,
      file: null,
      progress: 0,
      uploadStarted: false,
      uploadSuccess: null
    };
  },
  methods: {
    ...mapActions(["updateModalState"]),
    reset() {
      (this.isDragOver = false),
        (this.isDropped = false),
        (this.fileName = ""),
        (this.fileSize = 0),
        (this.file = null),
        (this.progress = 0),
        (this.uploadStarted = false);
    },
    handleUpload() {
      try {
        let formData = new FormData();
        formData.append("file", this.file);
        this.uploadStarted = true;
        const response = Axios.post("http://localhost:4000/upload", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            this.progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (this.progress === 100) {
            }
          },
          timeout: 15000,
          data: data => {
            debugger;
          }
        });
        response
          .then(data => {
            this.uploadSuccess = true;
          })
          .catch(error => {
            this.uploadSuccess = false;
            this.uploadStarted = false;
            console.log(error);
          });
      } catch (error) {
        this.uploadStarted = false;
      }
    },
    handleCancel() {
      this.updateModalState({
        status: false,
        title: "",
        componentToRender: ""
      });
    },
    handleClear() {
      this.isDragOver = false;
      this.isDropped = false;
      this.fileName = "";
      this.fileSize = 0;
      this.progress = 0;
      this.uploadStarted = false;
    },
    handleDrop(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      this.isDragOver = false;
      const {
        dataTransfer: { files }
      } = ev;
      const file = files[0];
      this.fileName = file.name;
      this.fileSize = file.size;
      this.isDropped = true;
      this.file = file;
    },
    handleDragOver(ev) {
      this.isDragOver = true;
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleDrag(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleDragStart(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleDragEnd(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleDragEnter(ev) {
      this.isDragOver = true;
      ev.preventDefault();
      ev.stopPropagation();
    },
    handleDragLeave(ev) {
      this.isDragOver = false;
      ev.preventDefault();
      ev.stopPropagation();
    }
  }
});
</script>

<style lang="scss" scoped>
.upload-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.upload-wrapper {
  padding: 0.5rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .drop-zone {
    height: 200px;
    width: 100%;
    background: rgba(0, 126, 229, 0.3);
    border: 2px dashed rgba(0, 126, 229, 0.5);
    border-radius: 4px;
    position: relative;
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    &.drag-over {
      border: 2px solid rgba(0, 126, 229, 0.5);
      background: #fff;
    }
    &.dropped {
      border-radius: 4px;
      background: #fff;
      border: 4px solid transparent;
    }
    .dropped-file {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      background: linear-gradient(
        to bottom,
        rgba(73, 155, 234, 1) 0%,
        rgba(32, 124, 229, 1) 100%
      );
      border: 1px solid #ddd;
      height: 100%;
      border-radius: 4px;

      .icon-wrapper {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;

        img {
          max-height: 100%;
          max-width: 100%;
        }
      }
      .file-name {
        font-size: 1.25rem;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .file-size {
        font-size: 1rem;
        font-weight: normal;
      }
      .success-msg {
        margin-top: 1rem;
        font-size: 1.25rem;
      }
    }
  }
  .intro-message {
    font-size: 2rem;
    color: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }
}
.upload-controls {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 3rem 0 0 0;
}
img {
  max-height: 100%;
  max-width: 100%;
}
.explorer-wrapper {
  height: 250px;
  width: 95%;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding-left: 5%;
  padding-top: 1rem;
  margin-top: 1rem;
}
.clear-upload {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}
.progress-wrap {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
}
</style>
