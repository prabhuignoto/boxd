<template>
  <div class="login-container">
    <header class="app-title">
      {{title}}
    </header>
    <section class="app-content">
      <section class="app-info-wrapper">
        <section class="app-info">Boxy is a Dropbox client for the Web.</section>
        <section class="app-info">Get started by logging with your dropbox account.</section>
      </section>
      <div class="app-logo-ensemble">
        <div class="app-logo-wrapper">
          <Logo />
        </div>
        <!-- <span class="app-logo"></span> -->
        <span class="right-arrow"></span>
        <span class="dropbox-logo"></span>
      </div>
      <div class="button-grp">
        <button class="dropbox-btn" v-on:click="handleLogin">Login</button>
        <button class="dropbox-btn" v-on:click="handleAccountCreation">Create Account</button>
      </div>
    </section>
  </div>
</template>

<script>
import Router from "../router";
import Logo from "../components/Logo/logo";

export default {
  components: {
    Logo
  },
  name: "Login",
  props: ["title"],
  methods: {
    handleLogin() {
      window.location = `${process.env.VUE_APP_API_SERVER}/auth/login`
    },
    handleAccountCreation() {
      window.location = "https://www.dropbox.com/login"
    }
  }
};
</script>

<style lang="scss"  src="./login.scss" scoped/>