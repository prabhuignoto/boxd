<template>
  <div class="explorer-grid">
    <GridItem
      v-for="item of items"
      :key="item.id"
      class="explorer-grid-item"
      :item="item"
      v-on:nav="onNav"
      v-on:selected="handleSelection"
      v-on:deselected="handleDeselection"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import GridItem from "./explorer-grid-item.vue";

import { Action } from "vuex-class";
import { JobType } from "../../modules/jobs";

@Component({
  name: "ExplorerGrid",
  components: {
    GridItem,
  },
})
export default class extends Vue {
  @Prop() items;
  @Action("clearAllBulk") clearAllBulk;
  @Action("updatePath") updatePath;
  @Action("addJob") addJob;
  @Action("addItemForBulk") addItemForBulk;
  @Action("removeItemFromBulk") removeItemFromBulk;

  onNav(path) {
    this.clearAllBulk();
    this.updatePath(path);

    this.addJob({
      jobType: JobType.LIST_FILES,
      data: {
        path,
      },
    });
  }

  handleSelection(data) {
    this.addItemForBulk({
      item: data,
    });
  }

  handleDeselection(data) {
    this.removeItemFromBulk({
      item: data,
    });
  }

  beforeDestroy() {
    this.clearAllBulk();
  }
}
</script>

<style lang="scss" scoped>
.explorer-grid {
  column-gap: 0.5rem;
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(auto-fit, 70px);
  height: 100%;
  justify-content: center;
  margin-left: 1rem;
  margin-top: 1rem;
  row-gap: 0.5rem;
}

.explorer-grid-item {
  align-items: center;
  display: flex;
  justify-content: center;
  user-select: none;
}
</style>
