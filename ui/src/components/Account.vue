<template>
  <section class="account-wrapper">
    <Popdown
      type="icon"
      rightOffset="0px"
      size="large"
      customWidth="180px"
      topOffset="3rem"
    >
      <template slot="icon">
        <i class="image-wrapper">
          <UserIcon />
        </i>
      </template>
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
import { mapActions } from "vuex";
import { UserIcon } from "vue-feather-icons";
import { LogOutIcon, HelpCircleIcon } from "vue-feather-icons";

export default {
  name: "Account",
  components: {
    Popdown,
    UserIcon,
    LogOutIcon,
    HelpCircleIcon,
  },
  data() {
    return {
      account: {
        name: {
          display_name: "",
          abbreviated_name: "",
        },
      },
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
        disableCloseBtn: true,
      });
    },
    handleAbout() {
      this.updateModalState({
        title: "",
        componentToRender: "About",
        status: true,
        disableHeader: true,
      });
    },
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
};
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

  .account-option {
    align-items: center;
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
}
</style>
