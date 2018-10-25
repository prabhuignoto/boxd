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
        <Popup 
          :content="getPopupComponent"
          :title="getPopupTitle"
          :disableHeader="getIsDisableHeader"
          :disableCloseBtn="getDisableCloseBtn"
        >
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
// import "../../node_modules/bulma/css/bulma.css";
import Logout from "../components/Logout";
import About from "../components/About";
import { mapGetters } from "vuex";

export default {
  components: {
    Account,
    Explorer,
    Popup,
    Popup,
    Button,
    Toolbar,
    FolderPath,
    Logout,
    About
  },
  data() {
    return {
      files: {
        entries: []
      }
    };
  },
  computed: {
    ...mapGetters([
      "isModalActive",
      "getPopupComponent",
      "getPopupTitle",
      "getIsDisableHeader"
    ])
  }
};
</script>

<style lang="scss" src="./dashboard.scss" />