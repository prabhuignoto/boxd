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
    height: 40px;

    input[type="text"] {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      border: 1px solid #007ee5;
      padding: 0 0.75rem;
      outline: none;
      font-size: 1rem;
    }
  }
</style>

