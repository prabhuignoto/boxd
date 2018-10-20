<template>
  <section class="stage2-container">
    <header>
      <span>Choose the destination</span>
    </header>
    <div class="explorer-wrapper">
      <div v-if="mode === 'move'">
        <MoveExplorerDest path=""/>
      </div>
      <div  v-if="mode === 'copy'">
        <CopyExplorerDest path=""/>
      </div>
    </div>
    <div class="summary">
      <div><span class="value mode">{{getSummaryMsg}}</span></div>
      <div><span class="title">From</span><span class="value">{{src}}</span></div>
      <div><span class="title">To</span><span class="value">{{dest}}</span></div>
    </div>
    <div class="stage2-controls">
      <div class="loader-wrapper" v-show="saving">
        <Loader />
      </div>
      <Button name="Back" :onClick="handlePrevious" v-if="!getSkipToFinal">
        <img src="../../assets/angle-left.svg" alt="previous">
      </Button>
      <Button name="Finish" :onClick="handleNext"
        :disabled="!canFinish"
        :buttonStyle="getStyle">
        <template slot="btn-icon">
          <img src="../../assets/check.svg" alt="complete">
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

<style lang="scss" scoped>
.stage2-container {
  width: 400px;
  header {
    width: 100%;
    span {
      width: 100%;
      text-align: left;
      display: block;
      padding-left: 0.5rem;
      margin: 0.5rem 0;
      font-weight: bold;
    }
  }
}
.explorer-wrapper {
  overflow: auto;
  border-radius: 3px;
  border: 1px solid #ddd;
  margin: 1rem 0;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
}
img {
  max-height: 100%;
  max-width: 100%;
}
.stage2-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 2rem 0 0 0;
}
.loader-wrapper {
  margin-right: auto;
  position: relative;
}
.summary {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 1rem;
  span {
    padding: 0.2rem;
    text-align: left;
    display: block;
    &.title {
      font-weight: bold;
      color: #000;
    }
    &.value {
      font-weight: bold;
      font-weight: normal;
      color: #007ee5;
      word-break: break-all;
    }
    &.mode {
      color: #000;
      background: #ffc200;
      border-radius: 5px;
      text-align: left;
      padding: 0.5rem;
      display: block;
    }
  }
  div {
    margin: 0.25rem 0;
  }
}
</style>z
