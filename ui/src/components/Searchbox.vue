<template>
  <div class="searchbox-wrapper">
    <input type="text" name="searchbox" id="searchbox-main" placeholder="search...">
  </div>
</template>

<script>
export default {
  name: "SearchBox"
}
</script>

<style lang="scss" scoped>
  .searchbox-wrapper {
    width: 100%;
    height: 36px;

    input[type="text"] {
      width: 100%;
      height: 100%;
      border-radius: 25px;
      border: 2px solid #007ee5;
      padding: 0 0.75rem;
      outline: none;
      font-size: 1rem;
    }
  }
</style>

