<template>
  <div class="explorer-settings-wrapper">
    <Popdown
      name
      type="icon"
      size="large"
      position="right"
      customWidth="160"
      topOffset="2.5rem"
      :forceClose="forceClose"
    >
      <template slot="icon">
        <i>
          <SettingsIcon color="#007ee5" />
        </i>
      </template>
      <template slot="menu">
        <ul class="explorer-settings">
          <li
            v-for="{ id, label } of options"
            :key="id"
            class="explorer-settings-item"
            :class="{ checked: isChecked(id) }"
            @click="handleViewMode(id)"
          >
            <span class="icon">
              <ListIcon v-if="id === 'list'" />
              <GridIcon v-if="id === 'folder'" />
            </span>
            <span class="name">{{ label }}</span>
            <span class="setting-selected-wrapper">
              <CheckIcon v-if="isChecked(id)"/>
            </span>
          </li>
        </ul>
      </template>
    </Popdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Popdown from "../Popdown/index.vue";
import { SettingsIcon, ListIcon, GridIcon, CheckIcon } from "vue-feather-icons";
import { Action, Getter } from "vuex-class";

@Component({
  name: "explorer-settings",
  components: {
    Popdown,
    SettingsIcon,
    ListIcon,
    GridIcon,
    CheckIcon
  },
})
export default class extends Vue {
  forceClose = 0;
  options = [
    { label: "List View", id: "list" },
    { label: "Folder view", id: "folder" },
  ];

  @Getter("getExplorerMode") getExplorerMode;
  @Action("updateExplorerMode") updateExplorerMode;

  isChecked(type: string) {
    return this.getExplorerMode === type;
  }

  handleViewMode(type: string) {
    this.forceClose = Date.now();
    this.updateExplorerMode(type);
  }
}
</script>

<style lang="scss" scoped>
.explorer-settings-item {
  align-items: center;
  color: #191919;
  cursor: pointer;
  display: flex;
  font-size: 0.85rem;
  font-weight: 400;
  justify-content: flex-start;
  list-style: none;
  padding: 0.5rem 0;
  width: 100%;

  &:hover {
    background: #007ee5;
    color: #fff;
  }

  &.checked {
    background: #fff;
    color: #007ee5;

    &:hover {
      background: #007ee5;
      color: #fff;
    }
  }
}

.explorer-settings {
  margin: 0;
  padding: 0;
  width: 100%;
}

.icon {
  align-items: center;
  display: flex;
  height: 1.25rem;
  margin-left: 0.5rem;
  width: 1.25rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.name {
  margin-left: 0.5rem;
  text-transform: capitalize;
}

.setting-selected-wrapper {
  display: flex;
  height: 1rem;
  margin-left: auto;
  margin-right: 0.5rem;
  width: 1rem;

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
