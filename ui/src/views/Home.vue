<template>
  <div class="home">
    <transition name="fade">
      <div class="login-wrapper">
        <Login title="Boxd" />
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import Login from "@/components/Login.vue";
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component({
  name: "home",
  components: {
    Login,
  },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.login-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  margin: 0 auto;
  margin-top: 6rem;
  max-width: 400px;
  min-width: 300px;
  padding: 1rem;
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
