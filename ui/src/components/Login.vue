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
        <span class="app-logo"></span>
        <span class="right-arrow"></span>
        <span class="dropbox-logo"></span>
      </div>
      <div class="button-grp">
        <button class="dropbox-btn" v-on:click="handleClick">Login with Dropbox</button>
        <button class="dropbox-btn" v-on:click="handleClick">Create Account</button>
      </div>
    </section>
  </div>
</template>

<script>
import Router from "../router"
export default {
  name: "Login",
  props: ["title"],
  methods: {
    handleClick() {
      window.location = "http://localhost:4000/auth/login"
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0.25rem;
  border-radius: 5px;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.25);
  width: 100%;
}
header {
  font-size: 1.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  width: 100%;
  background: #007ee5;
  color: #fff;
  padding: 0.75rem 0;
  border-radius: 3px;
}
.app-logo-ensemble {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  margin-top: 0.5rem;
  width: 75%;
  span {
    display: block;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
  }
  .dropbox-logo {
    background-image: url(../assets/dropbox-2.svg);
    height: 4rem;
    width: 4rem;
  }
  .app-logo {
    background-image: url(../assets/cubes.svg);
    height: 4rem;
    width: 4rem;
  }
  .right-arrow {
    background-image: url(../assets/arrow-right.svg);
    height: 2rem;
    width: 2rem;
  }
}
.app-info-wrapper {
  margin-bottom: 2rem;
  .app-info {
    font-size: 1.2rem;
    font-weight: 500;
    width: 100%;
    margin: 0.5rem 0;
  }
}
.app-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1rem;
}
.button-grp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  /* border: 1px solid red; */
  width: 90%;
}
.dropbox-btn {
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  padding: 0.75rem;
  background: #007ee5;
  color: #fff;
  cursor: pointer;
  margin: 0 0.5rem;
  width: 100%;
  margin: 0.5rem 0;
}
</style>
