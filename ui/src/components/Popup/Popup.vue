<template>
    <section class="popup" tabindex="0" @keyup.esc="handleClose">
      <div class="popup-container">
        <div class="closebutton-wrapper">
          <slot></slot>
        </div>
        <header class="popup-header">
          <span class="popup-title">
            {{title}}
          </span>
        </header>
        <div class="popup-content" v-if="content !== ''">
          <component :is="content"></component>
        </div>
      </div>
    </section>
</template>

<script>
import Account from "../Account";
import { mapActions } from "vuex";

export default {
  name: "Popup",
  props: ["content", "title"],
  mounted: function() {
    this.$nextTick(function() {
      this.$el.focus();
    });
  },
  methods: {
    ...mapActions(["updateModalState"]),
    handleClose() {
      this.updateModalState({
        status: false,
        title: "",
        componentToRender: ""
      });
    }
  }
};
</script>

<style lang="scss" src="./popup.scss" />
