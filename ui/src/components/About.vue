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
  align-items: center;
  display: flex;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  height: 100%;
  height: 130px;
  justify-content: space-around;
  width: 100%;
}

.info {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo {
  color: #2b2d42;
  font-size: 3rem;
  font-weight: 700;
}

.version {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
}

.built-with {
  font-size: 0.9rem;
}

.copyright {
  font-size: 0.9rem;
}
</style>
