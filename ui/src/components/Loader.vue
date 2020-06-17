<template>
  <div class="loader-wrapper translucent">
    <LoaderIcon size="2x" />
  </div>
</template>

<script>
import { LoaderIcon } from "vue-feather-icons";
export default {
  name: "Loader",
  props: ["size", "translucent"],
  components: {
    LoaderIcon,
  },
  computed: {
    getClass() {
      if (this.translucent) {
        return "loader-wrapper translucent";
      } else {
        return "loader-wrapper";
      }
    },
  },
};
</script>

<style lang="scss" src="./loader.scss" scoped />
