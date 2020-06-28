<template>
  <button @click="onClick" :class="getDefaultStyle">
    <i class="btn-icon-wrapper">
      <slot name="btn-icon"></slot>
    </i>
    <span class="label" v-if="name">{{ name }}</span>
    <slot name="menu"></slot>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "Button",
})
export default class extends Vue {
  // @Prop()
  @Prop() name;
  @Prop() onClick;
  @Prop() size;
  @Prop() buttonStyle;
  @Prop() marginLess;

  get getDefaultStyle() {
    return {
      [this.size]: true,
      [this.buttonStyle ? this.buttonStyle : "default"]: true,
    };
  }
}
</script>

<style lang="scss" src="./button.scss" scoped />
