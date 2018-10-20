<template>
  <section class="stage2-container">
    <header>
      <span>Choose the source by selecting a file or folder</span>
    </header>
    <div class="explorer-wrapper">
      <div class="move-explorer-wrapper" v-if="mode === 'move'">
        <MoveExplorerSrc path="" />
      </div>
      <div class="copy-explorer-wrapper" v-else-if="mode === 'copy'">
        <CopyExplorerSrc path="" />
      </div>
    </div>
    <div class="selected-src">
      <!-- <span>You have selected</span> -->
      <span class="value">
        {{selectedSource}}
      </span>
    </div>
    <div class="stage2-controls">
      <Button name="Back" :onClick="handlePrevious">
        <template slot="btn-icon">
          <img src="../../assets/angle-left.svg" alt="next">
        </template>
      </Button>
      <Button name="Next" :onClick="handleNextStep" :disabled="!isSourceSelected" :buttonStyle="getStyle">
        <template slot="btn-icon">
          <img src="../../assets/angle-right.svg" alt="next">
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
import MoveExplorerSrc from "./MoveExplorerSrc";
import CopyExplorerSrc from "./CopyExplorerSrc";
import Button from "../Form/Button";
import { mapActions } from "vuex";

export default {
  components: {
    MoveExplorerSrc,
    CopyExplorerSrc,
    Button
  },
  props: ["handleNext", "handlePrevious", "mode"],
  computed: {
    selectedSource() {
      if (this.mode === "move") {
        return this.$store.getters.moveResxSrc;
      } else {
        return this.$store.getters.copyResxSrc;
      }
    },
    isSourceSelected() {
      if (this.mode === "move") {
        return this.$store.getters.moveResxSrc !== "";
      } else {
        return this.$store.getters.copyResxSrc !== "";
      }
    },
    getStyle() {
      if (!this.isSourceSelected) {
        return "disabled";
      }
    }
  },
  methods: {
    handleNextStep() {
      this.handleNext();
    },
    handleCancel() {
      this.updateModalState({
        state: false,
        componentToRender: "",
        title: ""
      });
      this.clearMoveResx();
    },
    ...mapActions([
      "updateModalState",
      "moveResxSource",
      "clearMoveResx",
      "moveResxSource",
      "copyResxSource",
    ])
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
  /* height: 300px; */
  overflow: auto;
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding-left: 1rem;
  padding-top: 1rem;
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
.selected-src {
  font-size: 1rem;
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.25rem 0.75rem;
  .value {
    margin-top: 0.5rem;
    display: block;
    width: 400px;
    word-break: break-all; 
    text-align: left;
    min-height: 40px;
    font-weight: bold;
    color: #007ee5;
  }
}
</style>
