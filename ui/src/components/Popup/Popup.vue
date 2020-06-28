<template>
  <section class="popup" tabindex="0" @keyup.esc="handleClose">
    <div class="popup-container" :style="{ width: `${width}px` }">
      <div class="closebutton-wrapper">
        <slot></slot>
      </div>
      <header class="popup-header" v-if="!disableHeader">
        <span class="popup-title">{{ getPopupTitle }}</span>
        <button
          class="close-modal"
          @click="handleClose"
          v-if="!getDisableCloseBtn"
        >
          <XIcon />
        </button>
      </header>
      <div class="popup-content" v-if="content !== ''">
        <component :is="content"></component>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { XIcon } from "vue-feather-icons";
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import MoveCopy from "../MoveCopy/MoveCopy.vue";
import UploadWindow from "../Upload/index.vue";
import CreateFolder from "../Folder/CreateFolder.vue";
import About from "../About.vue";
import Logout from "../Logout.vue";

@Component({
  components: {
    XIcon,
    MoveCopy,
    UploadWindow,
    CreateFolder,
    About,
    Logout,
  },
  name: "Popup",
})
export default class extends Vue {
  @Prop() content;
  @Prop() title;
  @Prop() disableHeader;
  @Prop() width;

  @Getter("getDisableCloseBtn") getDisableCloseBtn;
  @Getter("getPopupTitle") getPopupTitle;

  @Action("updateModalState") updateModalState;

  mounted() {
    this.$nextTick(function () {
      // this.$el.focus();
    });
  }

  handleClose() {
    this.updateModalState({
      status: false,
      title: "",
      componentToRender: "",
      disableHeader: false,
      disableCloseBtn: false,
    });
  }
}
</script>

<style lang="scss" src="./popup.scss" scoped />
