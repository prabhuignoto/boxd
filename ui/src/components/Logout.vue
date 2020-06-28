<template>
  <section class="logout-wrapper">
    <div class="logout-loader-wrapper">
      <Loader type="throb" message="Please wait as we sign you out" />
    </div>
  </section>
</template>

<script>
import Loader from "./Loader";
import Vue from "vue";
import Axios from "axios";
import { Component } from "vue-property-decorator";
import { Action } from "vuex-class";

@Component({
  components: {
    Loader,
  },
  name: "Logout",
})
export default class extends Vue {
  @Action("updateModalState") updateModalState;

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
  }
}
</script>

<style lang="scss" scoped>
.logout-wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
}

.logout-loader-wrapper {
  align-items: center;
  align-self: center;
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 200px;

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
