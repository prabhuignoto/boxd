<template>
  <section class="stage2-container">
    <header>
      <span>Choose the destination</span>
    </header>
    <div class="stage3-explorer-wrapper">
      <div v-if="mode === 'move'">
        <MoveExplorerDest path=""/>
      </div>
      <div  v-if="mode === 'copy'">
        <CopyExplorerDest path=""/>
      </div>
    </div>
    <div class="summary">
      <div><span class="value mode">{{getSummaryMsg}}</span></div>
      <div><span class="mvcopy-summary-title">From</span><span class="value">{{src}}</span></div>
      <div><span class="mvcopy-summary-title">To</span><span class="value">{{dest}}</span></div>
    </div>
    <div class="stage2-controls">
      <div class="stage2-loader-wrapper" v-show="saving">
        <Loader />
      </div>
      <Button name="Back" :onClick="handlePrevious" v-if="!getSkipToFinal">
        <template slot="btn-icon">
          <img src="../../assets/angle-left.svg" alt="previous">
        </template>
      </Button>
      <Button name="Finish" :onClick="handleNext"
        :disabled="!canFinish"
        :buttonStyle="getStyle">
        <template slot="btn-icon">
          <img src="../../assets/check-white.svg" alt="complete" v-if="!canFinish">
          <img src="../../assets/check.svg" alt="complete" v-else>
        </template>
      </Button>
      <Button name="Cancel" :onClick="handleCancel">
        <template slot="btn-icon">
          <img src="../../assets/times.svg" alt="cancel">
        </template>
      </Button>
    </div>
  </section>
</template>

<script>
import MoveExplorerDest from "./MoveExplorerDest";
import CopyExplorerDest from "./CopyExplorerDest";
import Button from "../Form/Button";
import { mapActions, mapGetters } from "vuex";
import Loader from "../Loader";

export default {
  components: {
    MoveExplorerDest,
    CopyExplorerDest,
    Button,
    Loader
  },
  beforeDestroy() {
    this.clearMoveResx();
    this.clearCopyResx();
    this.skipToFinal(false);
    this.updateMoveCopyMode("");
  },
  computed: {
    ...mapGetters([
      "getSkipToFinal",
      "mvCopyMode",
      "moveResxSrc",
      "copyResxSrc",
      "moveResxDest",
      "copyResxDest"
    ]),
    mode() {
      return this.mvCopyMode;
    },
    src() {
      if (this.mode === "move") {
        return this.moveResxSrc;
      } else {
        return this.copyResxSrc;
      }
    },
    dest() {
      if (this.mode === "move") {
        return this.moveResxDest;
      } else {
        return this.copyResxDest;
      }
    },
    canFinish() {
      if (this.mode === "move") {
        return this.moveResxSrc && this.moveResxDest;
      } else {
        return this.copyResxSrc && this.copyResxDest;
      }
    },
    getStyle() {
      if (!this.canFinish || this.saving) {
        return "disabled";
      }
    },
    getSummaryMsg() {
      if (this.mode === "move") {
        return "You are moving a resource";
      } else {
        return "You are copying a resource";
      }
    }
  },
  props: ["handleComplete", "handlePrevious", "saving"],
  methods: {
    ...mapActions([
      "updateModalState",
      "clearMoveResx",
      "clearCopyResx",
      "skipToFinal",
      "updateMoveCopyMode"
    ]),
    handleNext() {
      this.handleComplete();
    },
    handleCancel() {
      this.updateModalState({
        state: false,
        componentToRender: "",
        title: ""
      });
    }
  }
};
</script>

<style lang="scss" src="./stage-three.scss" />