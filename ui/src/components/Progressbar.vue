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
export default {
  name: "ProgressBar",
  props: ["value"],
  computed: {
    getStyle() {
      return {
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: `${this.value}%`,
        borderRadius: ".1rem",
        background: "#4BB543",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .progressbar-container {
    border-radius: 0.1rem;
    width: 100%;
    height: 100%;
    position: relative;
    background: #d9d9d9;
  }
  i {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    color: #4bb543;

    svg {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
