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
  align-items: center;
  display: flex;
  justify-content: center;
}

#app {
  color: #2c3e50;
  font-family: 'Nunito', 'Open Sans', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 900px;
  text-align: center;
  width: 100%;
}

#nav {
  padding: 30px;

  a {
    color: #2c3e50;
    font-weight: 700;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
