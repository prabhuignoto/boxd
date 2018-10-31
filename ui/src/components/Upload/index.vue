<template>
  <section class="upload-main">
    <!-- drop zone starts here -->
    <section class="upload-wrapper">
      <div :class="setClass" 
        @drop="handleDrop" @dragover="handleDragOver"
        @drag="handleDrag" @dragstart="handleDragStart"
        @dragend="handleDragEnd" @dragenter="handleDragEnter"
        @dragleave="handleDragLeave" @click="openInputFile" :disabled="uploadStarted || uploadSuccess"
      >
        <!-- dropzone main -->
        <span class="intro-message" v-if="!isDropped">Drop your file</span>
        <div v-if="isDropped" class="dropped-file" :style="getResultStyle" >
          <i class="dropzone-backdrop-icon">
            <img src="../../assets/upload_flat.svg" alt="upload icon">
          </i>
          <div class="uploaded-file-attrs">
            <span class="file-name" v-if="!uploadSuccess">{{fileName}}</span>
            <span v-if="uploadSuccess" class="upload-success-msg">
              Upload to Dropbox is complete.
            </span>
            <div class="file-name" v-if="!uploadSuccess">{{prettySize}}</div>
          </div>
          <div class="progress-wrap" v-if="uploadStarted && !uploadSuccess">
            <ProgressBar :value="progress" />
          </div>
        </div>
        <!-- dropzone main -->

        <!-- clear upload -->
        <div class="clear-upload" v-if="isDropped && !uploadStarted">
          <Button buttonStyle="icon" :onClick="handleClear" v-if="!uploadSuccess">
            <template slot="btn-icon">
              <img src="../../assets/times.svg" alt="clear-upload">
            </template>
          </Button>
        </div>
        <!-- clear upload -->

        <!-- input file -->
        <input type="file" id="input-file" style="display: none" @change="handleInputFile" :disabled="uploadSuccess || uploadStarted">
        <!-- input file -->
      </div>

      <!-- file explorer -->
      <div class="upload-file-explorer-container" v-if="getUploadExplorerStatus && !uploadSuccess">
        <span class="upload-explorer-header">Choose a destination to upload</span>
        <div class="upload-explorer-wrapper">
          <RootFolder :onClick="handleRootFolder"/>
          <UploadExplorer path="" />
        </div>
      </div>
      <!-- file explorer -->
    </section>
    <!-- drop zone ends here -->

    <!-- selected path -->
    <div class="upload-path-selection" v-if="fileName !== '' && !uploadSuccess">
      <span v-if="!uploadSuccess">Uploading to </span>
      <span v-if="uploadSuccess">Uploaded to </span>
      <span class="highlight">{{this.getUploadPath}}</span>
    </div>
    <!-- selected path -->

    <!-- form controls -->
    <div class="upload-controls">
      <Button name="Upload" :onClick="handleUpload" 
        :disabled="canDisableUpload" :buttonStyle="getStyle" v-if="!uploadSuccess">
          <template slot="btn-icon">
            <img src="../../assets/check.svg" alt="upload" v-if="!canDisableUpload">
            <img src="../../assets/check-white.svg" alt="upload" v-if="canDisableUpload">
          </template>
      </Button>
      <Button name="Close" :onClick="handleCancel">
        <template slot="btn-icon">
          <img src="../../assets/times.svg" alt="cancel upload">
        </template>
      </Button>
    </div>
    <span class="ps" v-if="!uploadSuccess">
      max file size: 50 Mb
    </span>
    <!-- form controls -->
  </section>
</template>

<script>
import Button from "../Form/Button";
import UploadExplorer from "./UploadExplorer";
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import Axios from "axios";
import ProgressBar from "../Progressbar";
import gql from "graphql-tag";
import PrettyBytes from "pretty-bytes";
import RootFolder from "../rootFolder";

export default Vue.component("UploadWindow", {
  components: {
    Button,
    ProgressBar,
    RootFolder
  },
  computed: {
    ...mapGetters([
      "getUploadPath",
      "getUploadExplorerStatus",
      "getExplorerPath"
    ]),
    canDisableUpload() {
      return !this.isDropped || this.uploadStarted || this.getUploadPath === "";
    },
    setClass() {
      return {
        "drop-zone": true,
        "drag-over": this.isDragOver,
        dropped: this.isDropped
      };
    },
    getStyle() {
      return this.canDisableUpload ? "disabled" : "";
    },
    getResultStyle() {
      if (this.uploadSuccess === true) {
        return {
          color: "#fff"
        };
      } else if (this.uploadSuccess === false) {
        return {
          background: "#cb2431",
          color: "#fff"
        };
      }
    },
    prettySize() {
      return this.fileSize ? PrettyBytes(this.fileSize) : "";
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
    ...mapActions([
      "updateModalState",
      "uploadFile",
      "updateUploadExplorerStatus",
      "refreshFileExplorer",
      "refetchData"
    ]),
    reset() {
      (this.isDragOver = false),
        (this.isDropped = false),
        (this.fileName = ""),
        (this.fileSize = 0),
        (this.file = null),
        (this.progress = 0),
        (this.uploadStarted = false);
    },
    handleRootFolder() {
      this.uploadFile("");
    },
    handleUpload() {
      try {
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("uploadPath", this.getUploadPath);
        this.uploadStarted = true;
        const response = Axios.post(
          `${process.env.VUE_APP_API_SERVER}/upload`,
          formData,
          {
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
            // timeout: 15000,
            data: data => {
              debugger;
            }
          }
        );
        response
          .then(data => {
            this.uploadSuccess = true;
            this.refetchData(true);
            this.refreshFileExplorer({
              status: true,
              path: this.getUploadPath
            });
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
    // * close the form
    handleCancel() {
      this.uploadFile("");
      this.updateUploadExplorerStatus(true);
      this.updateModalState({
        status: false,
        title: "",
        componentToRender: ""
      });
    },
    // * clear dropzone
    handleClear(ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.isDragOver = false;
      this.isDropped = false;
      this.fileName = "";
      this.fileSize = 0;
      this.progress = 0;
      this.uploadStarted = false;
    },
    openInputFile() {
      this.$el.querySelector("input[type=file]").click();
    },
    // * all drag and drop events
    handleInputFile(ev) {
      const file = ev.target.files[0];
      if (file) {
        this.fileName = file.name;
        this.fileSize = file.size;
        this.isDropped = true;
        this.file = file;
      }
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

<style lang="scss" src= "./upload.scss"></style>
