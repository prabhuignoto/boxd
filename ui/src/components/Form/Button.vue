<template>
  <button @click="onClick" :class="getDefaultStyle">
    <i class="btn-icon-wrapper">
      <slot name="btn-icon"></slot>
    </i>  
    <!-- </i> -->
    <span class="label">{{name}}</span>
    <slot name="menu"></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["name", "onClick", "msize", "buttonStyle", "marginLess"],
  computed: {
    getDefaultStyle() {
      let style = {
        
      }
      return {
        [this.msize]: true,
        [this.buttonStyle ? this.buttonStyle : "default"]: true
      };
    }
  }
};
</script>

<style lang="scss" src="./button.scss" scoped/>
