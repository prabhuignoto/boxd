<template>
  <div class="loader-wrapper">
    <div class="spinner">
      <LoaderIcon :size="size" v-if="type === 'spinner'" />
    </div>
    <div class="throbbing-loader" v-if="type === 'throb'">
      <div class="throb-ball active"></div>
      <span class="throb-ball-msg" v-if="message">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { LoaderIcon } from "vue-feather-icons";
import Vue from "vue";

export default Vue.extend({
  name: "Loader",
  props: {
    size: {
      default: "1.5x",
      type: String,
    },
    type: {
      default: "spinner",
    },
    message: {
      default: "",
    },
  },
  components: {
    LoaderIcon,
  },
});
</script>

<style lang="scss" src="./loader.scss" scoped />
