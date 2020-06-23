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

<script>
import { mapActions, mapGetters } from "vuex";
import { XIcon } from "vue-feather-icons";

export default {
  name: "Popup",
  props: ["content", "title", "disableHeader", "width"],
  mounted: function () {
    this.$nextTick(function () {
      this.$el.focus();
    });
  },
  components: {
    XIcon,
  },
  computed: {
    ...mapGetters(["getDisableCloseBtn", "getPopupTitle"]),
  },
  methods: {
    ...mapActions(["updateModalState"]),
    handleClose() {
      this.updateModalState({
        status: false,
        title: "",
        componentToRender: "",
        disableHeader: false,
        disableCloseBtn: false,
      });
    },
  },
};
</script>

<style lang="scss" src="./popup.scss" scoped />
