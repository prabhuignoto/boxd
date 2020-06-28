<template>
  <section class="stage-one-wrapper">
    <header class="stage-one-header">
      <!-- <span>Select the operation to proceed further</span> -->
    </header>
    <div class="move-copy-selection">
      <label for="move" :class="{ selected: moveSelected }">
        <i>
          <MoveIcon />
        </i>
        <span>Move Files</span>
        <input
          type="radio"
          name="move-copy-radio"
          id="move"
          @click="handleSelection('move')"
        />
        <CheckIcon
          :style="{ visibility: moveSelected ? 'visible' : 'hidden' }"
        />
      </label>
      <label for="copy" :class="{ selected: copySelected }">
        <i>
          <CopyIcon />
        </i>
        <span>Copy Files</span>
        <input
          type="radio"
          name="move-copy-radio"
          id="copy"
          @change="handleSelection('copy')"
        />
        <CheckIcon
          :style="{ visibility: copySelected ? 'visible' : 'hidden' }"
        />
      </label>
    </div>
    <div class="stage1-controls">
      <Button
        name="Next"
        :onClick="handleStepOne"
        :disabled="!isModeSelected"
        :buttonStyle="getStyle"
      >
        <template slot="btn-icon">
          <ChevronRightIcon />
        </template>
      </Button>
    </div>
  </section>
</template>

<script lang="ts">
import Button from "../Form/Button.vue";
import {
  CheckIcon,
  ChevronRightIcon,
  MoveIcon,
  CopyIcon,
} from "vue-feather-icons";

import { Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import Vue from "vue";

@Component({
  name: "StageOne",
  components: {
    Button,
    CheckIcon,
    ChevronRightIcon,
    MoveIcon,
    CopyIcon,
  },
})
export default class extends Vue {
  @Prop() handleNext;

  @Action("updateModalState") updateModalState;
  @Action("updateMoveCopyMode") updateMoveCopyMode;
  @Action("clearMoveResx") clearMoveResx;

  mode = "";

  get moveSelected() {
    return this.mode === "move";
  }
  get copySelected() {
    return this.mode === "copy";
  }
  get isModeSelected() {
    return this.mode !== "";
  }
  get getStyle() {
    if (!this.isModeSelected) {
      return "disabled xl";
    } else {
      return "xl";
    }
  }

  handleSelection(mode) {
    this.mode = mode;
    this.updateMoveCopyMode(mode);
  }

  dismissPopup() {
    this.updateModalState({
      status: false,
      componentToRender: "",
      title: "",
    });
    if (this.mode === "move") {
      this.clearMoveResx();
    }
  }

  handleStepOne() {
    this.handleNext();
  }
}
</script>

<style lang="scss" src="./stage-one.scss" scoped />
