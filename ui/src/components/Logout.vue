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
    Loader,
  },
  methods: {
    ...mapActions(["updateModalState"]),
  },
  mounted() {
    setTimeout(async () => {
      try {
        const response = await Axios.post(
          `${process.env.VUE_APP_API_SERVER}/logout`,
          {},
          {
            withCredentials: true,
            responseType: "text/json",
          }
        );
        const { success } = response.data;
        if (success) {
          window.location.href = `${process.env.VUE_APP_UI_URL}`;
        }
      } catch (error) {
        console.error("Failed to logout.");
      }
    }, 100000);
  },
});
</script>

<style lang="scss" scoped>
.logout-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
}

.logout-loader-wrapper {
  align-items: center;
  align-self: center;
  display: flex;
  height: 2rem;
  justify-content: center;
  margin-top: 1rem;
  width: 2rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.message {
  background: #fff;
  display: block;
  font-family: Nunito, Open Sans, Arial, Helvetica, sans-serif;
  font-size: 1rem;
  font-weight: 400;
}
</style>
