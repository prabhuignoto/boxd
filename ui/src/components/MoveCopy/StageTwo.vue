<template>
  <section class="stage2-container">
    <div class="stage2-explorer-wrapper">
      <div class="move-explorer-wrapper" v-if="mode === 'move'">
        <MoveExplorerSrc path />
      </div>
      <div class="copy-explorer-wrapper" v-else-if="mode === 'copy'">
        <CopyExplorerSrc path />
      </div>
    </div>
    <div class="selected-src">
      <span class="value" v-if="selectedSource">
        {{ mode === "move" ? moveResxSrcFormatted : copyResxSrcFormatted }}
      </span>
    </div>
    <div class="stage2-controls">
      <Button name="Back" :onClick="handlePrevious" :buttonStyle="getStyle">
        <template slot="btn-icon">
          <ChevronLeftIcon />
        </template>
      </Button>
      <Button
        name="Next"
        v-if="isSourceSelected"
        :onClick="handleNextStep"
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
import MoveExplorerSrc from "./MoveExplorerSrc.vue";
import CopyExplorerSrc from "./CopyExplorerSrc.vue";
import Button from "../Form/Button.vue";
import { ChevronRightIcon } from "vue-feather-icons";
import { ChevronLeftIcon } from "vue-feather-icons";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import Vue from "vue";

@Component({
  components: {
    MoveExplorerSrc,
    CopyExplorerSrc,
    Button,
    ChevronRightIcon,
    ChevronLeftIcon,
  },
})
export default class extends Vue {
  @Prop() handleNext;
  @Prop() handlePrevious;
  @Prop() mode;

  @Getter("moveResxSrcFormatted") moveResxSrcFormatted;
  @Getter("copyResxSrcFormatted") copyResxSrcFormatted;
  @Getter("moveResxSrc") moveResxSrc;
  @Getter("copyResxSrc") copyResxSrc;
  @Getter("moveResxDest") moveResxDest;
  @Getter("getMoveCopyMode") getMoveCopyMode;

  @Action("updateModalState") updateModalState;
  @Action("moveResxSource") moveResxSource;
  @Action("clearMoveResx") clearMoveResx;
  @Action("copyResxSource") copyResxSource;

  get selectedSource() {
    if (this.getMoveCopyMode === "move") {
      return this.moveResxSrc;
    } else {
      return this.copyResxSrc;
    }
  }

  get isSourceSelected() {
    if (this.getMoveCopyMode === "move") {
      return this.moveResxSrc;
    } else {
      return this.copyResxSrc;
    }
  }

  get getStyle() {
    if (!this.isSourceSelected) {
      return "disabled xl";
    } else {
      return "xl";
    }
  }

  handleNextStep() {
    this.handleNext();
  }

  handleCancel() {
    this.updateModalState({
      state: false,
      componentToRender: "",
      title: "",
    });
    this.clearMoveResx();
  }
}
</script>

<style lang="scss" src="./stage-two.scss" scoped />
