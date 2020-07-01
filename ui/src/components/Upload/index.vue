<template>
  <section class="upload-main">
    <!-- drop zone starts here -->
    <section class="upload-wrapper">
      <div
        :class="setClass"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @drag="handleDrag"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="openInputFile"
        :disabled="canDisableInput"
      >
        <!-- dropzone main -->
        <span class="intro-message" v-if="!isDropped"
          >Drop your file here to start the upload</span
        >
        <div v-if="isDropped" class="dropped-file" :style="getResultStyle">
          <i class="dropzone-backdrop-icon">
            <!-- <img src="../../assets/upload_flat.svg" alt="upload icon" /> -->
            <UploadCloudIcon></UploadCloudIcon>
          </i>
          <div class="uploaded-file-attrs">
            <span class="file-name" v-if="!uploadSuccess">{{ fileName }}</span>
            <span v-if="uploadSuccess" class="upload-success-msg"
              >Upload to Dropbox is complete.</span
            >
            <div class="file-name" v-if="!uploadSuccess">{{ prettySize }}</div>
          </div>
        </div>

        <!-- input file -->
        <input
          type="file"
          id="input-file"
          style="display: none;"
          @change="handleInputFile"
          :disabled="canDisableInput"
        />
        <!-- input file -->
      </div>

      <!-- file explorer -->
      <div
        class="upload-file-explorer-container"
        v-if="canShowFileExplorer"
        :class="{ disabled: canDisableInput }"
      >
        <!-- <span class="upload-explorer-header">Choose destination</span> -->
        <div class="upload-explorer-wrapper">
          <UploadExplorer path />
        </div>
      </div>
      <!-- file explorer -->
    </section>
    <!-- drop zone ends here -->

    <!-- selected path -->
    <div class="upload-path-selection" v-if="canShowUpladPathSelection">
      <!-- <span v-if="!uploadSuccess">Uploading to</span> -->
      <span v-if="uploadSuccess">Uploaded to</span>
      <span class="highlight" v-if="getUploadPathCustom">{{
        getUploadPathFormatted
      }}</span>
    </div>
    <!-- selected path -->

    <!-- form controls -->
    <div class="upload-controls">
      <span class="ps" v-if="!uploadStarted">max file size: 50 Mb</span>
      <span class="ps" v-if="uploadStarted && !uploadSuccess">
        <span class="loader-wrapper">
          <Loader />
        </span>
        <span class="ps-subtext"
          >uploading... you will be notified on completion.</span
        >
      </span>
      <Button
        name="Upload File"
        :onClick="handleUpload"
        :disabled="canDisableUpload"
        :buttonStyle="getStyle"
        v-if="canShowControls"
      >
        <template slot="btn-icon">
          <ArrowUpIcon />
        </template>
      </Button>
    </div>
    <!-- form controls -->
  </section>
</template>

<script lang="ts">
import Button from "../Form/Button.vue";
import UploadExplorer from "./UploadExplorer.vue";
import Vue from "vue";
// import ProgressBar from "../Progressbar";
import PrettyBytes from "pretty-bytes";
import RootFolder from "../rootFolder.vue";
import { UploadCloudIcon, ArrowUpIcon } from "vue-feather-icons";
import Loader from "../Loader.vue";
import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "Upload",
  components: {
    Button,
    // ProgressBar,
    RootFolder,
    UploadExplorer,
    ArrowUpIcon,
    UploadCloudIcon,
    Loader,
  },
})
export default class extends Vue {
  @Getter("getUploadPath") getUploadPath;
  @Getter("getUploadExplorerStatus") getUploadExplorerStatus;
  @Getter("getExplorerPath") getExplorerPath;
  // @Getter("canEnableClearBtn") canEnableClearBtn;
  @Getter("getUploadPathFormatted") getUploadPathFormatted;
  @Getter("getJobDataById") getJobDataById;

  @Action("updateModalState") updateModalState;
  @Action("uploadFile") uploadFile;
  @Action("updateUploadExplorerStatus") updateUploadExplorerStatus;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("refetchData") refetchData;
  @Action("closeModal") closeModal;
  @Action("addJob") addJob;

  isDragOver = false;
  isDropped = false;
  fileName = "";
  fileSize = 0;
  file;
  progress = 0;
  uploadStarted = false;
  uploadSuccess = false;

  get getUploadPathCustom() {
    return this.getUploadPath === "/$root" ? "/home" : this.getUploadPath;
  }

  get canDisableUpload() {
    return !this.isDropped || this.uploadStarted;
  }

  get setClass() {
    return {
      "drop-zone": true,
      "drag-over": this.isDragOver,
      dropped: this.isDropped,
    };
  }

  get getStyle() {
    return this.canDisableUpload ? "disabled xl" : "xl";
  }

  get getResultStyle() {
    if (this.uploadSuccess === true) {
      return {
        color: "#fff",
      };
    } else if (this.uploadSuccess === false) {
      return {
        background: "#cb2431",
        color: "#fff",
      };
    } else {
      return null;
    }
  }

  get prettySize() {
    return this.fileSize ? PrettyBytes(this.fileSize) : "";
  }

  get canEnableClearBtn() {
    return this.isDropped && !this.uploadStarted;
  }

  get canShowUpladPathSelection() {
    return this.fileName !== "" && !this.uploadSuccess;
  }

  get canShowFileExplorer() {
    return (
      this.getUploadExplorerStatus && !this.uploadSuccess && this.isDropped
    );
  }

  get canDisableInput() {
    // check if the upload is completed or just started and disable input controls
    return this.uploadSuccess || this.uploadStarted;
  }

  get canShowControls() {
    return !this.uploadSuccess && this.isDropped;
  }

  reset() {
    (this.isDragOver = false),
      (this.isDropped = false),
      (this.fileName = ""),
      (this.fileSize = 0),
      (this.file = null),
      (this.progress = 0),
      (this.uploadStarted = false);
  }

  handleRootFolder() {
    this.uploadFile("/$root");
  }

  handleUpload() {
    try {
      if (this.file) {
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append(
          "uploadPath",
          this.getUploadPath === "/$root" ? "" : this.getUploadPath
        );
        this.uploadStarted = true;
        this.addJob({
          jobType: "UPLOAD",
          data: {
            formData,
          },
        });
        this.uploadSuccess = true;
        this.closeModal();
      }
    } catch (error) {
      this.uploadSuccess = false;
      this.uploadStarted = false;
    }
  }

  // * close the form
  handleCancel() {
    this.uploadFile("");
    this.updateUploadExplorerStatus(true);
    this.updateModalState({
      status: false,
      title: "",
      componentToRender: "",
    });
  }

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
  }

  openInputFile() {
    (this.$el.querySelector("input[type=file]") as HTMLElement).click();
  }

  // * all drag and drop events
  handleInputFile(ev) {
    const file = ev.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileSize = file.size;
      this.isDropped = true;
      this.file = file;
    }
  }

  handleDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.isDragOver = false;
    const {
      dataTransfer: { files },
    } = ev;
    const file = files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.isDropped = true;
    this.file = file;
  }

  handleDragOver(ev) {
    this.isDragOver = true;
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDrag(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragStart(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragEnd(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragEnter(ev) {
    this.isDragOver = true;
    ev.preventDefault();
    ev.stopPropagation();
  }

  handleDragLeave(ev) {
    this.isDragOver = false;
    ev.preventDefault();
    ev.stopPropagation();
  }

  beforeDestroy() {
    this.uploadFile("");
    this.updateUploadExplorerStatus(true);
  }
}
</script>

<style lang="scss" src="./upload.scss" scoped></style>
