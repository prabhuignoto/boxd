<template>
  <div class="loader-wrapper translucent">
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="loader-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: ["size", "translucent"],
  computed: {
    getClass() {
      if(this.translucent) {
        return "loader-wrapper translucent";
      } else {
        return "loader-wrapper";
      }
    }
  }
};
</script>

<style lang="scss" src="./loader.scss" scoped/>