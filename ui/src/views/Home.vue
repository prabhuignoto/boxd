<template>
  <div class="home">
    <transition name="fade">
      <div class="login-wrapper">
        <Login title="Boxy" />
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";

export default {
  name: "home",
  components: {
    Login,
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  left: 0;
  margin: 0 auto;
  margin-top: 6rem;
  max-width: 400px;
  min-width: 300px;
  padding: 1rem;
  right: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
