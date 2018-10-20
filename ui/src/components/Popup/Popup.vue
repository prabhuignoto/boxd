<template>
    <section class="popup" tabindex="0" @keyup.esc="handleClose">
      <div class="popup-container">
        <div class="closebutton-wrapper">
          <slot></slot>
        </div>
        <header>
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

<style lang="scss" scoped>
.popup {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  outline: none;
  header {
    width: 100%;
    border-bottom: 2px solid #007ee5;
    .popup-title {
      display: block;
      font-weight: bold;
      max-width: 100%;
      overflow: hidden;
      text-align: left;
      padding: 0.5rem 0.5rem;
      font-size: 1rem;
      color: #007ee5;
    }
    margin-bottom: 0.5rem;
  }

  .popup-container {
    /* padding: 1rem 1rem 0.5rem 1rem; */
    padding: 0.75rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: #fff;
    border-radius: 4px;
    min-width: 400px;
    position: relative;
    box-shadow: 0 0 20px 1px rgba(0,0,0,0.25);
  }
  .popup-content {
    width: 100%;
    padding: 0.25rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .closebutton-wrapper {
    position: absolute;
    z-index: 100;
    top: -2rem;
    right: -2rem;
    border-radius: 50%;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 2.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}
</style>
