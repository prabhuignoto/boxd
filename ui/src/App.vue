<template>
  <div id="app">
    <Header />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
import WebFontLoader from "webfontloader";
import Header from "./components/Header";

export default {
  components: {
    Header
  },
  created() {
     WebFontLoader.load({
      google: {
        families: ['Open Sans:400,500']
      },
    });
  },
}
</script>


<style lang="scss">
#app {
  font-family: "Open Sans", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
html,body,#app {
  height: 100%;
}
body {
  margin: 0;
}
html {
  &.wf-loading {
    & > * {
      display: none;
    }
  }
}
</style>
