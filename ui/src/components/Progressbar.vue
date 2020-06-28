<template>
  <div class="progress-bar-wrapper">
    <!-- <i v-if="value === 0">
      <img src="../assets/check.svg" alt="completed">
      <CheckIcon size="1x" />
    </i>-->
    <div class="progressbar-container">
      <span :style="getStyle"></span>
    </div>
  </div>
</template>

<script>
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({
  name: "ProgressBar",
})
export default class extends Vue {
  @Prop() value;

  get getStyle() {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: `${this.value}%`,
      borderRadius: ".1rem",
      background: "#4BB543",
    };
  }
}
</script>

<style lang="scss" scoped>
.progress-bar-wrapper {
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;

  .progressbar-container {
    background: #d9d9d9;
    border-radius: 0.1rem;
    height: 100%;
    position: relative;
    width: 100%;
  }

  i {
    color: #4bb543;
    height: 1.5rem;
    margin-right: 0.5rem;
    width: 1.5rem;

    svg {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
