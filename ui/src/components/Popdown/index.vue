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
        v-show="visible"
        tabindex="0"
        @blur="close"
        @key:esc="close"
        :style="style"
        ref="popdownButton"
      >
        <slot name="menu"></slot>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import Button from "../Form/Button.vue";

import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({
  name: "Popdown",
  components: {
    Button,
  },
})
export default class extends Vue {
  @Prop() name;
  @Prop() type;
  @Prop() size;
  @Prop() leftOffset;
  @Prop() customWidth;
  @Prop() topOffset;
  @Prop() position;

  visible = false;
  childWidth = 0;
  pos = {
    x: 0,
    y: 0,
  };
  clientWidth = 0;
  style = {
    left: "",
    top: "",
    width: "",
  };

  togglePopdown(ev) {
    const $el = this.$el;
    const { x, y } = this.$el.getBoundingClientRect();
    this.style = {
      left:
        this.position === "right"
          ? `${x - (Number(this.customWidth) - $el.clientWidth)}px`
          : `${x}px`,
      width: `${this.customWidth}px`,
      top: `${y + $el.clientHeight + 15}px`,
    };
    const popdown = $el && $el.querySelector(".popdown");
    if (popdown && popdown.contains(ev.target)) {
      return false;
    } else {
      this.visible = !this.visible;
      this.$nextTick(function () {
        (this.$el.querySelector(".popdown") as HTMLElement).focus();
      });
    }
  }

  close() {
    this.visible = false;
  }

  getStyle() {
    return {
      width: this.customWidth,
    };
  }
}
</script>

<style lang="scss" src="./popdown.scss" scoped />
