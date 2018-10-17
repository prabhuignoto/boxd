<template>
  <section class="dashboard-wrapper">
    <div class="explorer-wrapper">
      <div class="toolbar-container">
        <Toolbar />
      </div>
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
import Explorer from "../components/Explorer/Explorer";
import Popup from "../components/Popup/Popup";
import Button from "../components/Form/Button";
import DeleteFolder from "../components/Folder/DeleteFolder";
import Toolbar from "../components/Toolbar/Toolbar";
import gql from "graphql-tag";

export default {
  components: {
    Account,
    Explorer,
    Popup,
    Popup,
    Button,
    Toolbar
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

<style lang="scss" scoped>
.dashboard-wrapper {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 1rem 2rem;
  max-width: 1600px;
}
.explorer-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.modal-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba($color: #000000, $alpha: 0.1);

  .close-modal {
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
  .img-close {
    width: 2.25rem;
    height: 2.25rem;
  }
}
.explorer-controls {
  width: 100%;
  display: flex;
  padding: 0.25rem;
  margin-bottom: 0.5rem;
}
.toolbar-container {
  margin-top: 0.5rem;
}
/* .fade-enter {
} */

.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: all 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0.9);
}
</style>
