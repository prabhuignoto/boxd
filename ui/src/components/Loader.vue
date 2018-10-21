<template>
  <div class="loader-wrapper">
    <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    <!-- <img src="../assets/loading.gif" alt="loading" v-bind:class="{'loader-icon': true, [size]: true}" /> -->
    <div class="loader-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",
  props: ["size"]
};
</script>

<style lang="scss" src="./loader.scss" />