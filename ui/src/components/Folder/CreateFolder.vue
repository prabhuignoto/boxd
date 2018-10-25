<template>
  <section class="create-folder-wrapper">
    <div class="create-folder-inputs">
      <Textbox name="name" label="Name" :onInput="onFolderInput" placeholder="Name of the folder"/>
    </div>
    <div class="create-folder-explorer-wrapper" v-if="!isCreateFolderExpHidden">
      <RootFolder :onClick="handleRootFolder" />
      <CreateFolderExplorer path="" />
    </div>
    <!-- <div class="selected-path-wrapper">
      <div class="crt-folder-sec-header">Your new folder will be created on this path</div>
      <div class="selected-path">{{selectedPath === "" ? "/" :selectedPath}}</div>
    </div> -->
    <div class="create-folder-controls">
      <div class="crt-folder-loader-wrapper" v-show="isMutating">
        <Loader />
      </div>
      <Button name="Create"
        :onClick="handleCreate"
        :disabled="!this.isPathSelected || this.isNameEmpty || isMutating"
        :buttonStyle="getStyle">
          <template slot="btn-icon">
            <img src="../../assets/check.svg" alt="create-folder" v-if="getStyle !== 'disabled'">
            <img src="../../assets/check-white.svg" alt="create-folder" v-if="getStyle === 'disabled'">
          </template>
      </Button>
      <Button name="Cancel" :onClick="handleCancel">
        <template slot="btn-icon">
          <img src="../../assets/times.svg" alt="close-create-folder">
        </template>
      </Button>
    </div>
    <div class="error-messages-grp" v-if="hasErrors">
      <span class="error-message" v-if="isNameEmpty">
        <span class="err-message-val">Folder name cannot be empty</span>
      </span>
      <span class="error-message" v-if="showFolderValidError">
        <span class="err-message-val">Please select the folder path to continue</span>
      </span>
    </div>
  </section>
</template>

<script>
import Textbox from "../Form/TextBox";
import Treeview from "../Treeview/Treeview";
import CreateFolderExplorer from "./CreateFolderExplorer";
import Button from "../Form/Button";
import gql from "graphql-tag";
import createFolderGQL from "../../graphql/createFolder.gql";
import Loader from "../Loader";
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import RootFolder from "../rootFolder";

export default Vue.component("CreateFolder", {
  components: {
    Textbox,
    Treeview,
    CreateFolderExplorer,
    Button,
    Loader,
    RootFolder
  },
  data() {
    return {
      folderName: "",
      createHandledOnce: 0,
      disableSave: false,
      isMutating: false
    };
  },
  beforeDestroy() {
    this.hideCreateFolderExplorer(false);
    this.createFolderSelection(null);
  },
  computed: {
    selectedPath() {
      return this.$store.getters.createFolderSelection;
    },
    isNameEmpty() {
      return this.folderName === "";
    },
    isPathSelected() {
      return this.selectedPath !== null;
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
        ? "disabled"
        : "";
    },
    ...mapGetters(["isCreateFolderExpHidden", "getWorkflowOrigin"])
  },
  methods: {
    ...mapActions([
      "createFolderSelection",
      "hideCreateFolderExplorer",
      "updatePath",
      "refetchData",
      "clearList"
    ]),
    handleCreate() {
      if (this.createHandledOnce < 1) {
        this.createHandledOnce += 1;
      }
      if (!this.hasErrors) {
        this.disableSave = true;
        this.isMutating = true;
        this.$apollo
          .mutate({
            mutation: gql(createFolderGQL),
            variables: {
              path: this.selectedPath,
              name: this.folderName
            },
            update: (store, { data: { handleCreate } }) => {
              this.$store.dispatch("updateModalState", {
                status: false,
                componentToRender: ""
              });
              if(this.getWorkflowOrigin === "toolbar") {
                this.clearList();
                this.updatePath(`${this.selectedPath}/`);
              } else if(this.getWorkflowOrigin === "context-control") {
                this.refetchData(true);
              }
            }
          })
          .then(data => {
            this.disableSave = true;
            this.isMutating = true;
          })
          .catch(error => {
            this.disableSave = true;
            this.isMutating = true;
          });
      }
    },
    handleCancel() {
      this.$store.dispatch("updateModalState", {
        status: false,
        componentToRender: ""
      });
    },
    onFolderInput($evt) {
      this.folderName = $evt.target.value;
    },
    handleRootFolder() {
      this.createFolderSelection("");
    }
  }
});
</script>

<style lang="scss" src="./create-folder.scss">
</style>
