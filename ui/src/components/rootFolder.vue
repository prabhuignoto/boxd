<template>
  <div class="root-folder" @click="onClick" tabindex="0">
    <i>
      <img src="../assets/folder.svg" alt="root-folder">
    </i>
    <span class="root-slash">\</span>
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
    width: 60px;
    margin-left: 0.5rem;
    margin-top: 0.5rem;
    &:focus {
      outline: 1px dotted #2B2D42;
      outline-offset: 2px;
    }
    i {
      width: 1.5rem;
      height: 1.5rem;
    }
    .root-slash {
      margin-left: 0.15rem;
    }
  }
</style>

