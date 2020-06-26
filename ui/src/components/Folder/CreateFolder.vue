<template>
  <section class="create-folder-wrapper">
    <div class="create-folder-inputs">
      <Textbox
        name="name"
        :onInput="onFolderInput"
        placeholder="Name..."
        :onEnter="handleEnter"
      />
    </div>
    <div class="create-folder-explorer-wrapper" v-if="!isCreateFolderExpHidden">
      <RootFolder :onClick="handleRootFolder" />
      <CreateFolderExplorer path />
    </div>
    <div class="selected-path-wrapper">
      <div class="selected-path" v-if="getFolderSelectionFormatted">
        {{
          getFolderSelectionFormatted === "" ? "/" : getFolderSelectionFormatted
        }}
      </div>
    </div>
    <div class="create-folder-controls">
      <div class="crt-folder-loader-wrapper" v-show="isMutating">
        <div class="crt-folder-loader-container">
          <Loader type="throb" />
        </div>
        <span class="loader-message">creating folder ...</span>
      </div>
      <Button
        name="Create"
        :onClick="handleCreate"
        :disabled="!this.isPathSelected || this.isNameEmpty || isMutating"
        :buttonStyle="getStyle"
      >
        <template slot="btn-icon">
          <CheckIcon />
        </template>
      </Button>
    </div>
    <div class="error-messages-grp" v-if="hasErrors">
      <span class="error-message" v-if="isNameEmpty">
        <span class="err-message-val">Folder name cannot be empty</span>
      </span>
      <span class="error-message" v-if="showFolderValidError">
        <span class="err-message-val"
          >Please select the folder path to continue</span
        >
      </span>
    </div>
  </section>
</template>

<script>
import Textbox from "../Form/TextBox.vue";
import CreateFolderExplorer from "./CreateFolderExplorer.vue";
import Button from "../Form/Button.vue";
import Loader from "../Loader.vue";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import RootFolder from "../rootFolder.vue";
import { CheckIcon } from "vue-feather-icons";

export default Vue.component("CreateFolder", {
  components: {
    Textbox,
    CreateFolderExplorer,
    Button,
    Loader,
    RootFolder,
    CheckIcon,
  },
  data() {
    return {
      folderName: "",
      createHandledOnce: 0,
      disableSave: false,
      isMutating: false,
    };
  },
  beforeDestroy() {
    this.hideCreateFolderExplorer(false);
    this.createFolderSelection(null);
  },
  computed: {
    isNameEmpty() {
      return this.folderName === "";
    },
    isPathSelected() {
      return this.getFolderSelection !== null;
    },
    showFolderValidError() {
      return this.createHandledOnce > 0 && !this.isPathSelected;
    },
    hasErrors() {
      return (
        (!this.isPathSelected || this.isNameEmpty) && this.createHandledOnce > 0
      );
    },
    getStyle() {
      return !this.isPathSelected || this.isNameEmpty || this.isMutating
        ? "disabled xl"
        : "xl";
    },
    ...mapGetters([
      "isCreateFolderExpHidden",
      "getWorkflowOrigin",
      "getExplorerPath",
      "getFolderSelectionFormatted",
      "getFolderSelection",
    ]),
  },
  methods: {
    ...mapActions([
      "createFolderSelection",
      "hideCreateFolderExplorer",
      "updatePath",
      "refetchData",
      "clearList",
      "refreshFileExplorer",
      "addJob",
      "closeModal",
    ]),
    handleEnter() {
      this.handleCreate();
    },
    async handleCreate() {
      if (this.createHandledOnce < 1) {
        this.createHandledOnce += 1;
      }
      if (!this.hasErrors) {
        this.disableSave = true;
        this.isMutating = true;
        this.addJob({
          jobType: "CREATE_FOLDER",
          data: {
            path: JSON.parse(JSON.stringify(this.getFolderSelection)),
            name: this.folderName,
          },
        });
        this.closeModal();
      }
    },
    handleCancel() {
      this.$store.dispatch("updateModalState", {
        status: false,
        componentToRender: "",
      });
    },
    onFolderInput($evt) {
      this.folderName = $evt.target.value.trim();
    },
    handleRootFolder() {
      this.createFolderSelection("");
    },
  },
});
</script>

<style lang="scss" src="./create-folder.scss" scoped></style>
