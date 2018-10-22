<template>
  <section class="dashboard-wrapper">
      <div class="toolbar-container">
        <Toolbar />
      </div>
      <div class="folder-path-container">
        <FolderPath />
      </div>
      <div class="explorer-main">
        <Explorer />
      </div>
    <transition name="fade">
      <div class="modal-area" v-if="isModalActive">
          <Popup v-bind:content="popupComponent" :title="popupTitle">
            <button class="close-modal" @click="closeModal">
              <img src="../assets/error.svg" alt="close" class="img-close">
            </button>
          </Popup>
      </div>
    </transition>
  </section>
</template>

<script>
import Account from "../components/Account";
import Explorer from "../components/Explorer/explorer";
import Popup from "../components/Popup/Popup";
import Button from "../components/Form/Button";
import DeleteFolder from "../components/Folder/DeleteFolder";
import Toolbar from "../components/Toolbar/Toolbar";
import gql from "graphql-tag";
import FolderPath from "../components/Path/FolderPath";
import "../../node_modules/bulma/css/bulma.css";

export default {
  components: {
    Account,
    Explorer,
    Popup,
    Popup,
    Button,
    Toolbar,
    FolderPath
  },
  data() {
    return {
      files: {
        entries: []
      }
    };
  },
  methods: {
    closeModal() {
      this.$store.dispatch("updateModalState", {
        status: false,
        componentToRender: ""
      });
    }
  },
  computed: {
    isModalActive() {
      return this.$store.getters.isModalActive;
    },
    popupComponent() {
      return this.$store.state.modal.componentToRender;
    },
    popupTitle() {
      return this.$store.state.modal.title;
    }
  }
};
</script>

<style lang="scss" src="./dashboard.scss" />