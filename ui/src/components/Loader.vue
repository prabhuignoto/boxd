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
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "Loader",
  components: {
    LoaderIcon,
  },
})
export default class extends Vue {
  @Prop({
    default: () => "1.5x",
    type: String,
  })
  size;

  @Prop({
    default: "spinner",
  })
  type;

  @Prop({
    default: "",
  })
  message;
}
</script>

<style lang="scss" src="./loader.scss" scoped />
