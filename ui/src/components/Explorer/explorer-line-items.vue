<template>
  <div class="line-items-wrapper" v-if="items.length">
    <header class="line-items-header-wrapper">
      <ul class="line-items-header">
        <li class="line-items-header-item bulk-selection-button-col"></li>
        <li class="line-items-header-item name">Name</li>
        <li class="line-items-header-item">Size</li>
        <li class="line-items-header-item">Created Date</li>
        <li class="line-items-header-item"></li>
      </ul>
    </header>
    <div class="line-items-container">
      <div class="line-item-wrapper" v-for="file in items" :key="file.id">
        <LineItem
          v-bind="file"
          v-on:selected="handleLineItemSelection"
          v-on:deselected="handleLineItemDeselection"
          v-if="!file.hidden"
          :showSelected="bulkSelected"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import LineItem from "./explorer-line-item";
import { CheckSquareIcon, SquareIcon } from "vue-feather-icons";
import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "explorer-line-items",
  components: {
    LineItem,
    SquareIcon,
    CheckSquareIcon,
  },
})
export default class extends Vue {
  bulkSelected = false;
  @Prop() items;
  @Getter("getJobsActive") getJobsActive;

  @Action("addItemForBulk") addItemForBulk;
  @Action("removeItemFromBulk") removeItemFromBulk;

  handleLineItemSelection(data) {
    this.addItemForBulk({
      item: data,
    });
  }

  handleLineItemDeselection(data) {
    this.removeItemFromBulk({
      item: data,
    });
  }
}
</script>

<style lang="scss" scoped>
.line-items-wrapper {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
  width: 100%;
}

.line-items-container {
  height: calc(100% - 4rem);
  overflow-y: auto;
  width: 100%;
}

.line-items-header-wrapper {
  box-shadow: 0 8px 6px -6px rgba(0, 0, 0, 0.2);
  height: 3rem;
  width: 100%;
}

.line-items-header {
  align-items: center;
  display: grid;
  grid-template-columns: 3rem 45% 20% 20% auto;
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}

.line-items-header-item {
  color: #191919;
  font-family: Nunito, Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;

  &.name {
    padding-left: 0.5rem;
  }
}

.line-item-wrapper {
  &:not(:last-child) {
    border-bottom: 1px solid #e5e5e5;
  }
}

.bulk-selection-button-col {
  align-items: center;
  display: flex;
  justify-content: center;
}

.bulk-selection-button {
  align-items: center;
  color: #e5e5e5;
  cursor: pointer;
  display: flex;
  height: 1.5rem;
  padding-left: 0.5rem;
  width: 1.5rem;

  &.selected {
    color: #007ee5;
  }

  &:hover {
    color: #007ee5;
  }

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
