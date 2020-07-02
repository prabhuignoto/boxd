<template>
  <div class="delete-folder-wrapper">
    <div class="delete-form-wrapper">
      <Textbox :placeholder="placeholder" :onInput="onInput" />
    </div>
    <div class="delete-resx-controls">
      <div class="del-folder-loader-wrapper" v-show="isMutating">
        <Loader type="throb" message="Processing..." />
      </div>
      <Button
        name="Delete"
        :onClick="handleDelete"
        :disabled="!canDelete"
        :buttonStyle="!canDelete || isMutating ? 'disabled' : 'danger'"
        v-if="canDelete"
      >
        <template slot="btn-icon">
          <CheckIcon />
        </template>
      </Button>
      <Button name="Cancel" :onClick="handleCancel" buttonStyle="xl">
        <template slot="btn-icon">
          <XIcon />
        </template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Button from "../Form/Button.vue";
import Loader from "../Loader.vue";
import gql from "graphql-tag";
import Textbox from "../Form/TextBox.vue";
import { CheckIcon, XIcon } from "vue-feather-icons";
import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "DeleteFolder",
  components: {
    Button,
    Loader,
    Textbox,
    CheckIcon,
    XIcon,
  },
})
export default class extends Vue {
  @Prop() name;
  isMutating = false;
  deleteConsentText = "";
  @Getter("getExplorerPath") getExplorerPath;

  @Action("updateModalState") updateModalState;
  @Action("deleteFolder") deleteFolder;
  @Action("updatePath") updatePath;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("removeItemFromBulk") removeItemFromBulk;

  get deletePath() {
    return this.$store.getters.deletePath;
  }
  get fileName() {
    const paths = this.deletePath.split("/");
    return paths[paths.length - 1];
  }
  get getTarget() {
    const parts = this.deletePath.split("/");
    return parts[parts.length - 1];
  }
  get placeholder() {
    return `Type delete to proceed`;
  }
  get canDelete() {
    return "delete" === this.deleteConsentText;
  }

  onInput(ev) {
    this.deleteConsentText = ev.target.value;
  }

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
          path: this.deletePath,
        },
      })
      .then(() => {
        this.isMutating = false;
        this.updateModalState({
          status: false,
          component: "",
          title: "",
        });
        const newPathArr = this.getExplorerPath.split("/").slice(0);
        newPathArr.pop();
        // this.removeItemFromBulk({
        //   path_lower: this.deletePath,
        // });
      })
      .catch(() => {
        this.isMutating = false;
      });
  }

  handleCancel() {
    this.deleteFolder("");
    this.updateModalState({
      status: false,
      component: "",
      title: "",
    });
  }
}
</script>

<style lang="scss" src="./delete-folder.scss" scoped />
