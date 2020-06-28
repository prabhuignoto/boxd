<template>
  <header class="app-header">
    <nav>
      <div class="logo">
        <span>Boxd</span>
      </div>
      <div class="account-wrapper">
        <Popdown
          :name="account.name.display_name"
          type="link"
          leftOffset="-1.25rem"
          v-if="!$apollo.loading"
          size="large"
        >
          <template slot="icon">
            <div class="image-wrapper">
              <img src="../assets/user-circle.svg" alt="user" />
            </div>
          </template>
          <template slot="menu">
            <ul></ul>
          </template>
        </Popdown>
      </div>
    </nav>
  </header>
</template>

<script>
import Popdown from "@/components/Popdown/index.vue";
import gql from "graphql-tag";
import { Component } from "vue-property-decorator";
import Vue from "vue";

@Component({
  components: {
    Popdown,
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
    `,
  },
})
export default class extends Vue {
  account = {
    name: {
      // display_name: "",
    },
  };
}
</script>

<style lang="scss" src="./header.scss" scoped />
