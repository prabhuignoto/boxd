<template>
  <section class="about-wrapper">
    <div class="logo">Boxd</div>
    <div class="info">
      <span class="version">Version: 0.1</span>
      <span class="copyright"
        >{{ new Date().getFullYear() }} &copy; PrabhuMurthy</span
      >
    </div>
  </section>
</template>

<script>
import Vue from "vue";

export default Vue.component("About", {
  name: "About",
});
</script>

<style lang="scss" scoped>
.about-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: Nunito, Open Sans, Arial, Helvetica, sans-serif;
  height: 100%;
  height: 130px;
  height: 350px;
  justify-content: space-around;
  width: 280px;
}

.info {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  color: #007ee5;
  font-size: 3rem;
  font-weight: 600;
  width: 100%;
}

.version {
  display: block;
  font-size: 0.9rem;
  font-weight: 400;
  width: 100%;
}

.built-with {
  font-size: 0.9rem;
}

.copyright {
  font-size: 0.9rem;
}
</style>
