<template>
  <section class="about-wrapper">
    <div class="logo">
      Boxy
    </div>
    <div class="info">
      <span class="version">Version: 0.1</span>
      <span class="copyright">2018 &copy; PrabhuMurthy</span>
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
  width: 100%;
  height: 100%;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.logo {
  font-size: 3rem;
  font-weight: 700;
  color: #2b2d42;
}
.version {
  font-size: 0.9rem;
  font-weight: 700;
  display: block;
}
.built-with {
  font-size: 0.9rem;
}
.copyright {
  font-size: 0.9rem;
}
</style>
