<template>
  <div class="context-control">
    <Popdown
      type="icon"
      size="large"
      leftOffset="0rem"
      topOffset="2.8rem"
      customWidth="300"
    >
      <template slot="icon">
        <!-- <img src="../../assets/bars.svg" alt="context menu" /> -->
        <BoxIcon color="#fff" />
      </template>
      <template slot="menu">
        <TreeviewWrapper />
      </template>
    </Popdown>
  </div>
</template>

<script>
import Popdown from "../Popdown/index";
import { BoxIcon } from "vue-feather-icons";
import TreeviewWrapper from "../Explorer/TreeviewWrapper";

export default {
  components: {
    Popdown,
    BoxIcon,
    TreeviewWrapper,
  },
};
</script>

<style lang="scss" scr="./control.scss" scoped />
