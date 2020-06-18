<template>
  <div class="delete-folder-wrapper">
    <div class="delete-alert">Tread with Caution</div>
    <Textbox :placeholder="placeholder" :onInput="onInput" />
    <div class="delete-resx-controls">
      <div class="del-folder-loader-wrapper" v-show="isMutating">
        <Loader />
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
      <Button name="Cancel" :onClick="handleCancel">
        <template slot="btn-icon">
          <XIcon />
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
import { CheckIcon, XIcon } from "vue-feather-icons";

export default Vue.component("DeleteFolder", {
  props: ["name"],
  components: {
    Button,
    Loader,
    Textbox,
    CheckIcon,
    XIcon,
  },
  data() {
    return {
      isMutating: false,
      deleteConsentText: "",
    };
  },
  computed: {
    ...mapGetters(["getExplorerPath"]),
    deletePath() {
      return this.$store.getters.deletePath;
    },
    fileName() {
      const paths = this.deletePath.split("/");
      return paths[paths.length - 1];
    },
    getTarget() {
      const parts = this.deletePath.split("/");
      return parts[parts.length - 1];
    },
    placeholder() {
      return `Type delete to proceed`;
    },
    canDelete() {
      return "delete" === this.deleteConsentText;
    },
  },
  methods: {
    ...mapActions([
      "updateModalState",
      "deleteFolder",
      "updatePath",
      "refetchData",
      "refreshFileExplorer",
      "removeItemFromBulk",
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
            path: this.deletePath,
          },
          // update(store, data) {},
        })
        .then(() => {
          this.isMutating = false;
          this.updateModalState({
            status: false,
            component: "",
            title: "",
          });
          let newPathArr = this.getExplorerPath.split("/").slice(0);
          newPathArr.pop();
          this.removeItemFromBulk({
            path_lower: this.deletePath,
          });
          this.refetchData(true);
          this.$nextTick(() => {
            this.refreshFileExplorer({
              status: true,
              path: this.getExplorerPath,
            });
          });
        })
        .catch(() => {
          this.isMutating = false;
        });
    },
    handleCancel() {
      this.deleteFolder("");
      this.updateModalState({
        status: false,
        component: "",
        title: "",
      });
    },
  },
});
</script>

<style lang="scss" src="./delete-folder.scss" scoped />
