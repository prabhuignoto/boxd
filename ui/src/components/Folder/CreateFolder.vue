<template>
  <section class="create-folder-wrapper">
    <div class="create-folder-inputs">
      <Textbox name="name" label="Folder Name" :onInput="onFolderInput" placeholder="Name of the folder"/>
    </div>
    <div class="create-folder-explorer-wrapper" v-if="!isCreateFolderExpHidden">
      <RootFolder :onClick="handleRootFolder" />
      <CreateFolderExplorer path="" />
    </div>
    <div class="selected-path-wrapper">
      <div class="crt-folder-sec-header">Your new folder will be created on this path</div>
      <div class="selected-path">{{selectedPath === "" ? "/" :selectedPath}}</div>
    </div>
    <div class="create-folder-controls">
      <div class="crt-folder-loader-wrapper" v-show="isMutating">
        <Loader />
      </div>
      <Button name="Create"
        :onClick="handleCreate"
        :disabled="!this.isPathSelected || this.isNameEmpty || isMutating"
        :buttonStyle="getStyle">
          <template slot="btn-icon">
            <img src="../../assets/check.svg" alt="create-folder">
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

export default Vue.component('CreateFolder', {
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
      folderName: '',
      createHandledOnce: 0,
      disableSave: false,
      isMutating: false
    }
  },
  beforeDestroy() {
    this.hideCreateFolderExplorer(false);
    this.createFolderSelection(null);
  },
  computed: {
    selectedPath() {
      return this.$store.getters.createFolderSelection
    },
    isNameEmpty() {
      return  this.folderName === "";
    },
    isPathSelected() {
      return this.selectedPath !== null;
    },
    showFolderValidError() {
      return this.createHandledOnce > 0 && !this.isPathSelected;
    },
    hasErrors() {
      return (!this.isPathSelected || this.isNameEmpty) && this.createHandledOnce > 0
    },
    getStyle() {
      return (!this.isPathSelected || this.isNameEmpty || this.isMutating) ?  "disabled" : "";
    },
    ...mapGetters(["isCreateFolderExpHidden"])
  },
  methods: {
    ...mapActions(["createFolderSelection", "hideCreateFolderExplorer", "updatePath"]),
    handleCreate() {
      if(this.createHandledOnce < 1) {
        this.createHandledOnce += 1;
      }
      if(!this.hasErrors) {
        this.disableSave = true;
        this.isMutating = true;
        this.$apollo.mutate({
          mutation: gql(createFolderGQL),
          variables: {
            path: this.selectedPath,
            name: this.folderName
          },
          update: (store, { data: { handleCreate }}) => {
            this.$store.dispatch("updateModalState", {
              status: false,
              componentToRender: ""
            });
            this.updatePath(`${this.selectedPath}/${this.folderName}`);
          }
        }).then((data) => {
          this.disableSave = true;
          this.isMutating = true;
        }).catch((error) => {
          this.disableSave = true;
          this.isMutating = true;
        })
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
  },
})
</script>

<style lang="scss" scoped>
  .create-folder-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .create-folder-explorer-wrapper {
    height: 400px;
    width: 400px;
    overflow-y: auto;
    padding: 1rem;
    margin-top: 1rem;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  .create-folder-controls {
    padding: 0.25rem 0;
    margin: 2rem 0 0.25rem 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    position: relative;
  }
  .selected-path-wrapper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    font-size: 0.85rem;
    font-weight: bold;
    /* padding: 0.5rem 0.5rem; */
    /* margin: 0.5rem 0.5rem; */
    padding-left: 1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    span {
      display: block;
      text-align: left;
    }

    .selected-path {
      font-weight: normal;
      margin-top: 0.5rem;
      max-width: 350px;
      text-align: left;
      border: 1px solid #ddd;
      border-radius: 3px;
      min-height: 1.75rem;
      padding-left: 0.5rem;
      width: 100%;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      color: #007ee5;
      font-weight: bold;
    }
  }
  .crt-folder-sec-header {
    font-size: 0.9rem;
  }
  .error-messages-grp {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 4px;
    background: #fff;
    width: 100%;
    margin-top: 0.5rem;
    /* background:red; */
  }
  .error-message {
    color: #cb2431;
    font-size: 0.9rem;
    margin-right: auto;
    display: block;
    margin: 0.25rem ;
    width: 100%;
    text-align: left;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .crt-folder-loader-wrapper {
    margin-right: auto;
    position: relative;
  }
  img {
    max-height: 100%;
    max-width: 100%;
  }
  .create-folder-inputs {
    width: 100%;
  }
</style>
