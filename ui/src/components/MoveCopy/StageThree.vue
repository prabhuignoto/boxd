<template>
  <section class="stage2-container">
    <div class="move-copy-selection">
      <label for="move" :class="{ selected: moveSelected }">
        <i>
          <CheckCircleIcon v-if="moveSelected" />
          <CircleIcon v-if="!moveSelected" />
        </i>
        <span>Move Files</span>
        <input
          type="radio"
          name="move-copy-radio"
          id="move"
          @click="handleSelection('move')"
        />
      </label>
      <label for="copy" :class="{ selected: copySelected }">
        <i>
          <CheckCircleIcon v-if="copySelected" />
          <CircleIcon v-if="!copySelected" />
        </i>
        <span>Copy Files</span>
        <input
          type="radio"
          name="move-copy-radio"
          id="copy"
          @change="handleSelection('copy')"
        />
      </label>
    </div>
    <div class="stage3-explorer-container">
      <div class="stage3-explorer-wrapper">
        <div v-if="getMoveCopyMode === 'move'">
          <MoveExplorerSrc path />
        </div>
        <div v-if="getMoveCopyMode === 'copy'">
          <CopyExplorerSrc path />
        </div>
      </div>
      <div class="stage3-explorer-wrapper">
        <div v-if="getMoveCopyMode === 'move'">
          <MoveExplorerDest path />
        </div>
        <div v-if="getMoveCopyMode === 'copy'">
          <CopyExplorerDest path />
        </div>
      </div>
    </div>
    <div class="summary">
      <div class="summary-final" v-if="src || dest">
        <span class="value" v-if="src">
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
import MoveExplorerSrc from "./MoveExplorerSrc.vue";
import CopyExplorerSrc from "./CopyExplorerSrc.vue";
import Button from "../Form/Button.vue";
import Loader from "../Loader.vue";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  MoveIcon,
  CopyIcon,
  CheckCircleIcon,
  CircleIcon,
} from "vue-feather-icons";

import { Component, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import Vue from "vue";

@Component({
  name: "StageThree",
  components: {
    MoveExplorerDest,
    CopyExplorerDest,
    MoveExplorerSrc,
    CopyExplorerSrc,
    Button,
    Loader,
    ChevronLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    ChevronRightIcon,
    MoveIcon,
    CopyIcon,
    CheckCircleIcon,
    CircleIcon,
  },
})
export default class extends Vue {
  mode = "";

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
      return this.moveResxSrc.path;
    } else {
      return this.copyResxSrc.path;
    }
  }

  get dest() {
    if (this.getMoveCopyMode === "move") {
      return this.moveResxDest.path === "" || this.moveResxDest.path;
    } else {
      return this.copyResxDest.path === "" || this.copyResxDest.path;
    }
  }

  get canFinish() {
    if (this.getMoveCopyMode === "move") {
      if (this.getBulkMode) {
        return this.moveResxDest;
      } else {
        const srcPath = this.moveResxSrc.path;
        const destPath = this.moveResxDest.path;

        return srcPath && destPath && srcPath !== destPath;
      }
    } else {
      if (this.getBulkMode) {
        return this.copyResxDest;
      } else {
        const srcPath = this.copyResxSrc.path;
        const destPath = this.copyResxDest.path;

        return srcPath && destPath && srcPath !== destPath;
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

  get moveSelected() {
    return this.mode === "move";
  }

  get copySelected() {
    return this.mode === "copy";
  }

  handleSelection(mode) {
    this.mode = mode;
    this.updateMoveCopyMode(mode);
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
