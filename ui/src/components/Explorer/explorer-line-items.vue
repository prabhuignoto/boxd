<template>
  <div class="line-items-wrapper">
    <header class="line-items-header-wrapper">
      <ul class="line-items-header">
        <li class="line-items-header-item"></li>
        <li class="line-items-header-item">Name</li>
        <li class="line-items-header-item">Size</li>
        <li class="line-items-header-item">Created Date</li>
        <li class="line-items-header-item"></li>
      </ul>
    </header>
    <div class="line-item-wrapper" v-for="file in items" :key="file.name">
      <LineItem
        v-bind="file"
        v-on:selected="handleLineItemSelection"
        v-on:deselected="handleLineItemDeselection"
        v-if="!file.hidden"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import LineItem from "./explorer-line-item";
import { mapActions } from "vuex";

export default Vue.extend({
  name: "explorer-line-items",
  props: ["items"],
  components: {
    LineItem,
  },
  methods: {
    ...mapActions(["addItemForBulk", "removeItemFromBulk"]),
    handleLineItemSelection(data) {
      this.addItemForBulk(data);
    },
    handleLineItemDeselection(data) {
      this.removeItemFromBulk(data);
    },
  },
});
</script>

<style lang="scss" scoped>
.line-items-wrapper {
  width: 100%;
}

.line-items-header-wrapper {
  width: 100%;
}

.line-items-header {
  align-items: center;
  border-bottom: 1px solid #cecece;
  display: grid;
  grid-template-columns: 3rem 45% 20% 20% auto;
  height: 2.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.line-items-header-item {
  color: #727272;
  font-family: Nunito, Arial, Helvetica, sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
}

.line-item-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>
