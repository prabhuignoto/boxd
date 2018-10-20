<template>
  <header class="app-header">
    <nav>
      <div class="logo">
        <span>Boxy</span>
      </div>
      <div class="account-wrapper">
        <Popdown :name="account.name.display_name" type="link" leftOffset="-1.25rem" v-if="!$apollo.loading" size="large">
          <template slot="icon">
            <div class="image-wrapper">
              <img src="../assets/user-circle.svg" alt="user">
            </div>
          </template>
          <template slot="menu">
            <ul>
              <li>Prabhu</li>
              <li>Prakash</li>
            </ul>
          </template>
        </Popdown>
      </div>
    </nav>
  </header>
</template>

<script>
import Account from "../components/Account";
import Popdown from "@/components/Popdown/index.vue";
import gql from "graphql-tag";

export default {
  components: {
    Account,
    Popdown
  },
  data() {
    return {
      account: {
        name: {
          display_name: ""
        }
      }
    };
  },
  apollo: {
    account: gql`
      {
        account: getAccount {
          name {
            display_name
          }
        }
      }
    `
  }
};
</script>

<style lang="scss" scoped>
.app-header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1600px;
  margin: 0 auto;
  border-radius: 3px;
  nav {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo {
    margin-right: auto;
    color: #007ee5;
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    img {
      height: 2.5rem;
      width: 2.5rem;
      margin-right: 0.5rem;
    }
  }
}
.account-wrapper {
}
</style>
