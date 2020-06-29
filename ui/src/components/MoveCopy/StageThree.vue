<template>
  <section class="stage2-container">
    <div class="stage3-explorer-wrapper">
      <div v-if="getMoveCopyMode === 'move'">
        <MoveExplorerDest path />
      </div>
      <div v-if="getMoveCopyMode === 'copy'">
        <CopyExplorerDest path />
      </div>
    </div>
    <div class="summary">
      <div class="summary-final">
        <span class="value">
          {{
            getMoveCopyMode === "move"
              ? moveResxSrcFormatted
              : copyResxSrcFormatted
          }}
        </span>
        <i>
          <ArrowRightIcon />
        </i>
        <span class="value" v-if="dest">
          {{
            getMoveCopyMode === "move"
              ? moveResxDestFormatted
              : copyResxDestFormatted
          }}
        </span>
      </div>
    </div>
    <div class="stage2-controls">
      <div class="stage3-loader-wrapper" v-if="saving">
        <Loader type="throb" message="Processing..." />
      </div>
      <div class="error-msg-container" v-if="errored">
        Failed to {{ getMoveCopyMode }}
      </div>
      <Button name="Back" :onClick="handlePrevious" :buttonStyle="getStyle">
        <template slot="btn-icon">
          <ChevronLeftIcon />
        </template>
      </Button>
      <Button
        name="Finish"
        :onClick="handleNext"
        :disabled="!canFinish"
        :buttonStyle="getStyle"
        :class="{ disabled: !canFinish }"
      >
        <template slot="btn-icon">
          <CheckIcon />
        </template>
      </Button>
    </div>
  </section>
</template>

<script lang="ts">
import MoveExplorerDest from "./MoveExplorerDest.vue";
import CopyExplorerDest from "./CopyExplorerDest.vue";
import Button from "../Form/Button.vue";
import Loader from "../Loader.vue";
import { ArrowRightIcon, ChevronLeftIcon, CheckIcon } from "vue-feather-icons";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import Vue from "vue";

@Component({
  name: "StageThree",
  components: {
    MoveExplorerDest,
    CopyExplorerDest,
    Button,
    Loader,
    ChevronLeftIcon,
    ArrowRightIcon,
    CheckIcon,
  },
})
export default class extends Vue {
  @Prop() handleComplete;
  @Prop() handlePrevious;
  @Prop() saving;
  @Prop() errored;
  @Prop() bulkMode;

  @Action("updateModalState") updateModalState;
  @Action("skipToFinal") skipToFinal;
  @Action("updateMoveCopyMode") updateMoveCopyMode;
  @Action("clearMoveCopyState") clearMoveCopyState;

  @Getter("getSkipToFinal") getSkipToFinal;
  @Getter("getMoveCopyMode") getMoveCopyMode;
  @Getter("moveResxSrc") moveResxSrc;
  @Getter("copyResxSrc") copyResxSrc;
  @Getter("moveResxDest") moveResxDest;
  @Getter("copyResxDest") copyResxDest;
  @Getter("moveResxSrcFormatted") moveResxSrcFormatted;
  @Getter("copyResxSrcFormatted") copyResxSrcFormatted;
  @Getter("moveResxDestFormatted") moveResxDestFormatted;
  @Getter("copyResxDestFormatted") copyResxDestFormatted;
  @Getter("getBulkMode") getBulkMode;

  get src() {
    if (this.getMoveCopyMode === "move") {
      return this.moveResxSrc;
    } else {
      return this.copyResxSrc;
    }
  }

  get dest() {
    if (this.getMoveCopyMode === "move") {
      return this.moveResxDest;
    } else {
      return this.copyResxDest;
    }
  }

  get canFinish() {
    if (this.getMoveCopyMode === "move") {
      if (this.getBulkMode) {
        return this.moveResxDest;
      } else {
        return this.moveResxSrc && this.moveResxDest;
      }
    } else {
      if (this.getBulkMode) {
        return this.copyResxDest;
      } else {
        return this.copyResxSrc && this.copyResxDest;
      }
    }
  }

  get getStyle() {
    if (!this.canFinish || this.saving) {
      return "disabled xl";
    } else {
      return "xl";
    }
  }

  get getSummaryMsg() {
    if (this.getMoveCopyMode === "move") {
      return "You are moving a resource";
    } else {
      return "You are copying a resource";
    }
  }

  handleNext() {
    this.handleComplete();
  }

  handleCancel() {
    this.updateModalState({
      state: false,
      componentToRender: "",
      title: "",
    });
  }

  beforeDestroy() {
    this.clearMoveCopyState();
    this.skipToFinal(false);
    this.updateMoveCopyMode(null);
  }
}
</script>

<style lang="scss" src="./stage-three.scss" scoped />
