<template>
  <div class="root-folder" @click="onClick" tabindex="0">
    <i>
      <img src="../assets/folder.svg" alt="root-folder">
    </i>
    <span class="root-slash">Home</span>
  </div> 
</template>

<script>
export default {
  name: "RootFolder",
  props: ["onClick"]
};
</script>

<style lang="scss" scoped>
  .root-folder {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    width: 80px;
    margin-left: 0.25rem;
    margin-top: 0.5rem;
    font-size: 0.95rem;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    &:focus {
      outline: 1px dotted #2B2D42;
      outline-offset: 2px;
    }
    i {
      width: 1.25rem;
      height: 1.25rem;
    }
    .root-slash {
      margin-left: 0.5rem;
    }
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
</style>

