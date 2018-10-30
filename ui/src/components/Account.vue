<template>
  <section class="account-wrapper">
    <Popdown :name="account.name.display_name" type="link" leftOffset="0.5rem" size="large" customWidth="180px" topOffset="3rem">
      <template slot="icon">
        <i class="image-wrapper">
          <img src="../assets/user.svg" alt="user">
        </i>
      </template>
      <template slot="menu">
        <ul class="account-options">
          <li class="account-option" @click="handleSignout">
            <i>
              <img src="../assets/sign-out-alt.svg" alt="signout">
            </i>
            <span>Logout</span>
          </li>
          <li class="account-option" @click="handleAbout">
            <i>
              <img src="../assets/question-circle.svg" alt="About">
            </i>
            <span>About</span>
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
        disableHeader: true,
        disableCloseBtn: true
      });
    },
    handleAbout() {
      this.updateModalState({
        title: "",
        componentToRender: "About",
        status: true,
        disableHeader: true
      });
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
.account-options {
  list-style: none;
  width: 100%;
  font-size: 0.95rem;
  padding: 0px;
  margin: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;

  .account-option {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    width: 100%;
    padding: 1rem 0 1rem 0;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;

    &:hover {
      background: #edf2f4;
      &::after {
        content: "";
        position: absolute;
        left: -1px;
        top: 0;
        width: 1px;
        height: 100%;
        background: #d90429;
      }
    }

    i {
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 1rem;
    }
    span {
      margin-left: 0.5rem;
    }
  }
}
</style>
