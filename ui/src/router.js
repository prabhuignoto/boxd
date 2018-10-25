import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Axios from "axios";

Vue.use(Router);

const AppRouter = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      beforeEnter: async (to, from, next) => {
        const response = await Axios.get("http://localhost:4000/isLoggedIn", {
          withCredentials: true
        });
        const { loggedin } = response.data;
        if (loggedin) {
          next();
        } else {
          next("/home");
        }
      }
    }
  ]
});

export default AppRouter;
