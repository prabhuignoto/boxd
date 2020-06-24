<template>
  <section class="popdown-wrapper" :style="getStyle">
    <Button
      :name="name"
      :onClick="togglePopdown"
      :buttonStyle="type"
      :size="size"
    >
      <template slot="btn-icon">
        <slot name="icon"></slot>
      </template>
    </Button>
    <transition name="movein">
      <div
        class="popdown"
        v-if="visible"
        tabindex="0"
        @blur="close"
        @key:esc="close"
        :style="getPopdownStyle"
        ref="popdownButton"
      >
        <slot name="menu"></slot>
      </div>
    </transition>
  </section>
</template>

<script>
import Button from "../Form/Button";

export default {
  name: "Popdown",
  components: {
    Button,
  },
  props: [
    "name",
    "type",
    "size",
    "leftOffset",
    "customWidth",
    "topOffset",
    "position",
  ],
  data() {
    return {
      visible: false,
      childWidth: 0,
    };
  },
  computed: {
    getPopdownStyle() {
      let style = {
        left: this.leftOffset,
        width: this.customWidth,
        top: this.topOffset ? this.topOffset : "100%",
      };
      if (this.position === "right") {
        return Object.assign({}, style, {
          right: 0,
        });
      } else {
        return Object.assign({}, style, {
          left: 0,
        });
      }
    },
  },
  methods: {
    togglePopdown(ev) {
      const $el = this.$el;
      const popdown = $el && $el.querySelector(".popdown");
      if (popdown && popdown.contains(ev.target)) {
        return false;
      } else {
        this.visible = !this.visible;
        this.$nextTick(function () {
          this.$el.querySelector(".popdown").focus();
        });
      }
    },
    close() {
      this.visible = false;
    },
    getStyle() {
      return {
        width: this.customWidth,
      };
    },
  },
};
</script>

<style lang="scss" src="./popdown.scss" scoped />
