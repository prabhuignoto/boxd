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
        >
        </Popup>
      </div>
    </transition>
    <transition name="peek">
        <Notification
          :type="notificationType"
          :title="notificationTitle"
          :message="getNewMessage"
          v-if="getNotificationStatus"
        />
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
import { mapGetters, mapActions } from "vuex";
import Notification from "../components/Notification";
import uniqid from "uniqid";

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
    About,
    Notification
  },
  data() {
    return {
      files: {
        entries: []
      },
      notificationTitle: "",
      notificationType: ""
    };
  },
  computed: {
    ...mapGetters([
      "isModalActive",
      "getPopupComponent",
      "getPopupTitle",
      "getIsDisableHeader",
      "getNotificationStatus",
      "getNewMessage"
    ])
  },
  methods: {
    ...mapActions(["addMessage"])
  },
  apollo: {
    $subscribe: {
      upload_completed: {
        query: gql`
          subscription {
            fileUploaded {
              success
              fileName
            }
          }
        `,
        result({ data: { fileUploaded } }) {
          if (fileUploaded.success) {
            this.notificationType = "Informational";
            this.notificationTitle = "Upload complete";
            this.addMessage({
              id: uniqid("notification-msg-"),
              message: `Uploaded ${fileUploaded.fileName} successfully`
            });
          }
        },
        updateQuery(previousResult, { subscriptionData }) {}
      },
      folder_deleted: {
        query: gql`
          subscription {
            folderDeleted {
              success
              name
            }
          }
        `,
        result({ data: { folderDeleted } }) {
          if (folderDeleted.success) {
            this.notificationType = "Informational";
            this.notificationTitle = "Folder deleted";
            this.addMessage({
              id: uniqid("notification-msg-"),
              message: `Deleted ${folderDeleted.name
                .split("/")
                .pop()} successfully`
            });
          }
        }
      },
      folder_added: {
        query: gql`
          subscription {
            folderAdded {
              success
              name
            }
          }
        `,
        result({ data: { folderAdded } }) {
          if (folderAdded.success) {
            this.notificationType = "Informational";
            this.notificationTitle = "Folder Added";
            this.addMessage({
              id: uniqid("notification-msg-"),
              message: `Added ${folderAdded.name
                .split("/")
                .pop()} successfully`
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" src="./dashboard.scss" />