<template>
  <section class="account-wrapper">
    <Popdown :name="account.name.display_name" type="link" leftOffset="0.5rem" size="large" customWidth="180px" topOffset="3rem">
      <template slot="icon">
        <i class="image-wrapper">
          <img src="../assets/user.svg" alt="user">
        </i>
      </template>
      <template slot="menu">
        <ul class="options">
          <li class="option" @click="handleSignout">
            <i>
              <img src="../assets/sign-out-alt.svg" alt="signout">
            </i>
            <span>Logout</span>
          </li>
          <li class="option" @click="handleHelp">
            <i>
              <img src="../assets/question-circle.svg" alt="help">
            </i>
            <span>Help</span>
          </li>
        </ul>
      </template>
    </Popdown>
  </section>
</template>

<script>
import gql from "graphql-tag";
import Popdown from "./Popdown/index";
import { mapActions } from "vuex";

export default {
  name: "Account",
  components: {
    Popdown
  },
  data() {
    return {
      account: {
        name: {
          display_name: "",
          abbreviated_name: ""
        }
      }
    };
  },
  methods: {
    ...mapActions(["updateModalState"]),
    handleSignout() {
      this.updateModalState({
        title: "",
        componentToRender: "Logout",
        status: true,
        disableHeader: true
      })
    },
    handleHelp() {
      
    }
  },
  apollo: {
    account: gql`
      {
        account: getAccount {
          name {
            display_name
            abbreviated_name
          }
        }
      }
    `
  }
};
</script>

<style lang="scss" scoped>
  .options {
    list-style: none;
    width: 100%;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-size: 0.95rem;
    .option {
      width: 100%;
      padding: 1rem 0 1rem 0.5rem;

      i {
        width: 26px;
        height: 26px;
      }
    }
  }
</style>
