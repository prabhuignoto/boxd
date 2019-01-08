<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import WebFontLoader from "webfontloader";
import Header from "./components/Header";
import Footer from "./views/Footer";
// import "../node_modules/bulma/css/bulma.css";

export default {
  components: {
    Header,
    Footer
  },
  created() {
     WebFontLoader.load({
      google: {
        families: ['Open Sans:400,500,600,700']
      },
    });
  },
}
</script>


<style lang="scss">
body {
  display: flex;
  align-items: center;
  justify-content: center;
}
#app {
  font-family: "Open Sans", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
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
