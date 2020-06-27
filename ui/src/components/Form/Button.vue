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
export default {
  name: "Button",
  props: ["name", "onClick", "size", "buttonStyle", "marginLess"],
  computed: {
    getDefaultStyle() {
      return {
        [this.size]: true,
        [this.buttonStyle ? this.buttonStyle : "default"]: true,
      };
    },
  },
};
</script>

<style lang="scss" src="./button.scss" scoped />
