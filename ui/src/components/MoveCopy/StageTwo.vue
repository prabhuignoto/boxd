<template>
  <section class="stage2-container">
    <header class="stage2-header">
      <span>Choose the source by selecting a file or folder</span>
    </header>
    <div class="stage2-explorer-wrapper">
      <div class="move-explorer-wrapper" v-if="mode === 'move'">
        <MoveExplorerSrc path />
      </div>
      <div class="copy-explorer-wrapper" v-else-if="mode === 'copy'">
        <CopyExplorerSrc path />
      </div>
    </div>
    <div class="selected-src">
      <!-- <span>You have selected</span> -->
      <span class="value">{{ selectedSource }}</span>
    </div>
    <div class="stage2-controls">
      <Button name="Back" :onClick="handlePrevious">
        <template slot="btn-icon">
          <ChevronLeftIcon />
        </template>
      </Button>
      <Button
        name="Next"
        v-if="isSourceSelected"
        :onClick="handleNextStep"
        :disabled="!isSourceSelected"
        :buttonStyle="getStyle"
      >
        <template slot="btn-icon">
          <ChevronRightIcon />
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
import { ChevronRightIcon } from "vue-feather-icons";
import { ChevronLeftIcon } from "vue-feather-icons";

export default {
  components: {
    MoveExplorerSrc,
    CopyExplorerSrc,
    Button,
    ChevronRightIcon,
    ChevronLeftIcon,
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
      } else {
        return "";
      }
    },
  },
  methods: {
    handleNextStep() {
      this.handleNext();
    },
    handleCancel() {
      this.updateModalState({
        state: false,
        componentToRender: "",
        title: "",
      });
      this.clearMoveResx();
    },
    ...mapActions([
      "updateModalState",
      "moveResxSource",
      "clearMoveResx",
      "moveResxSource",
      "copyResxSource",
    ]),
  },
};
</script>

<style lang="scss" src="./stage-two.scss" scoped />
