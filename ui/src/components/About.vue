<template>
  <section class="about-wrapper">
    <div class="close-modal" @click="closeModal">
      <XIcon />
    </div>
    <div class="logo">Boxd</div>
    <div class="info">
      <span class="version">Version: 1.0</span>
      <span class="copyright"
        >{{ new Date().getFullYear() }} &copy; PrabhuMurthy</span
      >
    </div>
  </section>
</template>

<script>
import Vue from "vue";
import { XIcon } from "vue-feather-icons";
import Component from "vue-class-component";
import { Action } from "vuex-class";

@Component({
  name: "About",
  components: {
    XIcon,
  },
})
export default class About extends Vue {
  @Action("closeModal") closeModal;
}
</script>

<style lang="scss" scoped>
.about-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-family: Nunito, Open Sans, Arial, Helvetica, sans-serif;
  height: 100%;
  height: 300px;
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

.close-modal {
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 1.5rem;
  justify-content: center;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  width: 1.5rem;

  svg {
    display: 100%;
    height: 100%;
  }
}
</style>
