<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import WebFontLoader from "webfontloader";

export default {
  components: {},
  created() {
    WebFontLoader.load({
      google: {
        families: ["Nunito:300,400,700"]
      }
    });
  }
};
</script>

<style lang="scss">
body {
  display: flex;
  align-items: center;
  justify-content: center;
}
#app {
  font-family: "Nunito", "Open Sans", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  min-height: 900px;
}

#nav {
  padding: 30px;
  a {
    font-weight: 700;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
