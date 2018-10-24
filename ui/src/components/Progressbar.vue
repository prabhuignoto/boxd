<template>
  <div class="progress-bar-wrapper">
    <i v-if="value === 100">
      <img src="../assets/check.svg" alt="completed">
    </i>
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
        borderRadius: "10px",
        background: "#2B2D42"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.progress-bar-wrapper {
  width: 100%;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  .progressbar-container {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    position: relative;
    /* border: 1px solid #ddd; */
    background: rgb(14, 3, 3);
  }
  i {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}
</style>
