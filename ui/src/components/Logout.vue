<template>
  <section class="logout-wrapper">
    <span class="message">Please wait as we sign you out</span>
    <div class="logout-loader-wrapper">
      <Loader />
    </div>
  </section>
</template>

<script>
import Loader from "./Loader";
import Vue from "vue";
import Axios from "axios";
import { mapActions } from "vuex";

export default Vue.component("Logout", {
  components: {
    Loader
  },
  methods: {
    ...mapActions(["updateModalState"]),
  },
  mounted() {
    setTimeout(async () => {
      try {
        const response = await Axios.post(`${process.env.VUE_APP_API_SERVER}/logout`, {}, {
          withCredentials: true,
          timeout: 5000,
          responseType: "text/json"
        });
        const {success, message} = response.data;
        if(success) {
          window.location.href=`${process.env.VUE_UI_URL}`
        }
      } catch (error) {
        console.error("Failed to logout.")
      }
    }, 3000);
  },
});

</script>

<style lang="scss" scoped>
  .logout-wrapper {
    padding: 1.5rem;
  }
  .loader-wrapper {
    margin-top: 1rem;
  }
  .message {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    display: block;
    background: #fff;
    font-weight: 700;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
  }
</style>
