<template>
  <div id="app" class="container is-fluid is-marginless">
    <!-- <Header /> -->
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    <Footer />
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
        families: ['Open Sans:400,500,700']
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
  /* margin: 1.5rem !important; */
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
html,body,#app {
  background: #fff;
  /* height: 100%; */
}
body {
  position: relative;
  margin-bottom: 80px;
}
html {
  &.wf-loading {
    & > * {
      display: none;
    }
  }
}
</style>
