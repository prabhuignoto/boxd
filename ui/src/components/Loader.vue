<template>
  <div class="loader-wrapper">
    <LoaderIcon :size="size" />
  </div>
</template>

<script>
import { LoaderIcon } from "vue-feather-icons";
import Vue from "vue";

export default Vue.extend({
  name: "Loader",
  props: {
    size: {
      default: "1.5x",
      type: String,
    },
  },
  components: {
    LoaderIcon,
  },
});
</script>

<style lang="scss" src="./loader.scss" scoped />
