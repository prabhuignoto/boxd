<template>
  <button @click="onClick" :class="getDefaultStyle">
    <!-- <i v-if="buttonStyle !== 'link'"> -->
    <i>
      <slot name="btn-icon"></slot>
    </i>  
    <!-- </i> -->
    <span>{{name}}</span>
    <slot name="menu"></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["name", "onClick", "msize", "buttonStyle", "marginLess"],
  computed: {
    getDefaultStyle() {
      return {
        [this.msize]: true,
        [this.marginLess]: true,
        [this.buttonStyle ? this.buttonStyle : "default"]: true
      };
    }
  }
};
</script>

<style lang="scss" src="./button.scss" />
