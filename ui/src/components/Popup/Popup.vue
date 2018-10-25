<template>
    <section class="popup" tabindex="0" @keyup.esc="handleClose">
      <div class="popup-container">
        <div class="closebutton-wrapper">
          <slot></slot>
        </div>
        <header class="popup-header" v-if="!disableHeader">
          <span class="popup-title">
            {{title}}
          </span>
        </header>
        <div class="popup-content" v-if="content !== ''">
          <component :is="content"></component>
        </div>
        <button class="close-modal" @click="handleClose" v-if="!getDisableCloseBtn">
          <img src="../../assets/cancel.svg" alt="close" class="img-close">
        </button>
      </div>
    </section>
</template>

<script>
import Account from "../Account";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Popup",
  props: ["content", "title", "disableHeader"],
  mounted: function() {
    this.$nextTick(function() {
      this.$el.focus();
    });
  },
  computed: {
    ...mapGetters(["getDisableCloseBtn"])
  },
  methods: {
    ...mapActions(["updateModalState"]),
    handleClose() {
      this.updateModalState({
        status: false,
        title: "",
        componentToRender: "",
        disableHeader: false,
        disableCloseBtn: false
      });
    }
  }
};
</script>

<style lang="scss" src="./popup.scss" />
