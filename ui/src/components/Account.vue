<template>
  <section class="account-wrapper">
    <div>Account</div>
    <div>{{account.name.display_name}}</div>
    <div>{{account.name.abbreviated_name}}</div>
  </section>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Account",
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