<template>
  <div class="delete-folder-wrapper">
    <div class="delete-alert">Tread with Caution</div>
    <div class="delete-message">
      <span>You are about to delete </br><b>
        {{deletePath}}
      </b></span>
      <span>
         Are you sure you want to proceed with this?
      </span>
    </div>
    <Textbox :placeholder="placeholder" :onInput="onInput"/>
    <div class="delete-resx-controls">
      <div class="del-folder-loader-wrapper" v-show="isMutating">
        <Loader />
      </div>
      <Button name="Delete" :onClick="handleDelete"
        :disabled="!canDelete" :buttonStyle="!canDelete || isMutating ? 'disabled' : 'danger'">
        <template slot="btn-icon">
          <img src="../../assets/check-white.svg" alt="ok">
        </template>
      </Button>
      <Button name="Cancel" :onClick="handleCancel">
        <template slot="btn-icon">
          <img src="../../assets/times.svg" alt="cancel">
        </template>
      </Button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Button from "../Form/Button";
import { mapActions, mapGetters } from "vuex";
import Loader from "../Loader";
import gql from "graphql-tag";
import Textbox from "../Form/TextBox";

export default Vue.component("DeleteFolder", {
  props: ["name"],
  components: {
    Button,
    Loader,
    Textbox
  },
  data() {
    return {
      isMutating: false,
      deleteConsentText: ""
    };
  },
  computed: {
    ...mapGetters(["getExplorerPath"]),
    deletePath() {
      return this.$store.getters.deletePath;
    },
    getTarget() {
      const parts = this.deletePath.split("/");
      return parts[parts.length - 1];
    },
    placeholder() {
      return `Type ${this.getTarget} to proceed`;
    },
    canDelete() {
      return this.getTarget === this.deleteConsentText;
    }
  },
  methods: {
    ...mapActions([
      "updateModalState",
      "deleteFolder",
      "updatePath",
      "refetchData"
    ]),
    onInput(ev) {
      this.deleteConsentText = ev.target.value;
    },
    handleDelete() {
      this.isMutating = true;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation deleteFolder($path: String!) {
              deleteFolder(path: $path) {
                name
              }
            }
          `,
          variables: {
            path: this.deletePath
          },
          update(store, data) {
            console.log(data);
          }
        })
        .then(data => {
          this.isMutating = false;
          this.updateModalState({
            status: false,
            component: "",
            title: ""
          });
          let newPathArr = this.getExplorerPath.split("/").slice(0);
          newPathArr.pop();
          this.refetchData(true);
        })
        .catch(error => {
          this.isMutating = false;
        });
    },
    handleCancel() {
      this.deleteFolder("");
      this.updateModalState({
        status: false,
        component: "",
        title: ""
      });
    }
  }
});
</script>

<style lang="scss" src="./delete-folder.scss" />