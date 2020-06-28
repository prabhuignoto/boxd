<template>
  <section class="account-wrapper">
    <Popdown
      type="icon"
      size="large"
      customWidth="180"
      topOffset="3rem"
      position="right"
    >
      <template slot="icon">
        <i class="image-wrapper">
          <UserIcon />
        </i>
      </template>
      // eslint-disable-next-line vue/no-unused-vars
      <template slot="menu">
        <ul class="account-options">
          <li class="account-option" @click="handleSignout">
            <i>
              <LogOutIcon />
            </i>
            <span>Logout</span>
          </li>
          <li class="account-option" @click="handleAbout">
            <i>
              <HelpCircleIcon />
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
import { UserIcon } from "vue-feather-icons";
import { LogOutIcon, HelpCircleIcon } from "vue-feather-icons";
import { Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import Vue from "vue";

@Component({
  name: "Account",
  components: {
    Popdown,
    UserIcon,
    LogOutIcon,
    HelpCircleIcon,
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
    `,
  },
})
export default class extends Vue {
  account = {
    name: {
      // display_name: "",
      // abbreviated_name: "",
    },
  };
  @Action("updateModalState") updateModalState;
  handleSignout() {
    this.updateModalState({
      title: "",
      componentToRender: "Logout",
      status: true,
      disableHeader: true,
      disableCloseBtn: true,
    });
  }

  handleAbout() {
    this.updateModalState({
      title: "",
      componentToRender: "About",
      status: true,
      disableHeader: true,
    });
  }
}
</script>

<style lang="scss" scoped>
.account-options {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  justify-content: flex-start;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.account-option {
  align-items: center;
  color: #007ee5;
  cursor: pointer;
  display: flex;
  font-family: Nunito, Open Sans, Arial, Helvetica, sans-serif;
  font-size: 0.85rem;
  font-weight: 400;
  justify-content: flex-start;
  padding: 0.5rem 0;
  position: relative;
  width: 100%;

  &:hover {
    background: #007ee5;
    color: #fff;
  }

  i {
    height: 1.5rem;
    margin-left: 1rem;
    width: 1.5rem;
  }

  span {
    margin-left: 0.5rem;
  }
}
</style>
