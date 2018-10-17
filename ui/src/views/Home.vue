<template>
  <div class="home">
    <div class="login-wrapper">
      <Login title="Boxy"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";

export default {
  name: "home",
  components: {
    Login,
  }
};
</script>

<style lang="scss" scoped>
  .login-wrapper {
    min-width: 300px;
    max-width: 400px;
    padding: 1rem;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
  }
</style>

