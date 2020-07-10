<template>
  <div
    class="resource"
    :class="{ selected, locked: item.lockType }"
    @mouseenter="handleShowCheckbox"
    @mouseleave="handleHideCheckbox"
  >
    <div
      class="resource-check-box"
      @click="toggleSelected"
      v-if="showCheckbox || selected"
    >
      <span v-if="!item.lockType">
        <CircleIcon v-if="!selected" />
        <CheckCircleIcon v-if="selected" />
      </span>
      <span v-else>
        <LockIcon />
      </span>
    </div>
    <div class="resource-icon">
      <FolderIcon v-if="item.type === 'folder'" />
      <FileIcon v-if="item.type === 'file'" />
    </div>
    <div class="resource-name" @click="handleNav($event, item.type, item.path)">
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import {
  FolderIcon,
  FileIcon,
  CircleIcon,
  CheckCircleIcon,
  LockIcon,
} from "vue-feather-icons";

@Component({
  name: "explorer-grid-item",
  components: {
    FolderIcon,
    FileIcon,
    CircleIcon,
    CheckCircleIcon,
    LockIcon,
  },
})
export default class extends Vue {
  selected = false;
  showCheckbox = false;
  @Prop() item;

  handleNav(event, type, path) {
    event.preventDefault();
    if (type === "folder") {
      this.$emit("nav", path);
    }
  }

  toggleSelected() {
    this.selected = !this.selected;

    const { name, hash, path, id } = this.item;

    if (this.selected) {
      this.$emit("selected", {
        name,
        contentHash: hash,
        pathLower: path,
        id,
      });
    } else {
      this.$emit("deselected", {
        name,
        contentHash: hash,
        pathLower: path,
        id,
      });
    }
  }

  toggleShowCheckbox() {
    this.showCheckbox = !this.showCheckbox;
  }

  handleShowCheckbox() {
    this.showCheckbox = true;
  }

  handleHideCheckbox() {
    this.showCheckbox = false;
  }
}
</script>

<style lang="scss" scoped>
.resource {
  border: 1px solid transparent;
  border-radius: 0.3rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.2rem 0;
  position: relative;
  width: 100%;

  &:hover,
  &.selected {
    background: #f5f5f5;
  }

  &.locked {
    filter: opacity(0.75);
  }
}

.resource-icon {
  color: #cce5f9;
  flex: 3;
  height: 0;
  width: 100%;

  svg {
    fill: #cce5f9;
    height: 100%;
    width: 100%;
  }
}

.resource-name {
  cursor: pointer;
  flex: 1;
  font-size: 0.75rem;
  font-weight: 400;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  &:hover {
    text-decoration: underline;
  }
}

.resource-check-box {
  color: #007ee5;
  cursor: pointer;
  height: 1.25rem;
  left: 0.25rem;
  position: absolute;
  top: 0.25rem;
  width: 1.25rem;
  z-index: 10;

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
