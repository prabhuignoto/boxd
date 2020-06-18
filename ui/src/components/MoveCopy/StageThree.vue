<template>
  <section class="stage2-container">
    <div class="stage3-explorer-wrapper">
      <div v-if="mode === 'move'">
        <MoveExplorerDest path />
      </div>
      <div v-if="mode === 'copy'">
        <CopyExplorerDest path />
      </div>
    </div>
    <div class="summary">
      <div class="summary-final">
        <span class="value">{{
          mode === "move" ? moveResxSrcFormatted : copyResxSrcFormatted
        }}</span>
        <i>
          <ArrowRightIcon />
        </i>
        <span class="value" v-if="dest !== ''">{{
          mode === "move" ? moveResxDestFormatted : copyResxDestFormatted
        }}</span>
      </div>
    </div>
    <div class="stage2-controls">
      <div class="stage3-loader-wrapper" v-if="saving">
        <Loader />
      </div>
      <div class="error-msg-container" v-if="errored">Failed to {{ mode }}</div>
      <Button name="Back" :onClick="handlePrevious" v-if="!getSkipToFinal">
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

<script>
import MoveExplorerDest from "./MoveExplorerDest";
import CopyExplorerDest from "./CopyExplorerDest";
import Button from "../Form/Button";
import { mapActions, mapGetters } from "vuex";
import Loader from "../Loader";
import { ArrowRightIcon, ChevronLeftIcon, CheckIcon } from "vue-feather-icons";

export default {
  components: {
    MoveExplorerDest,
    CopyExplorerDest,
    Button,
    Loader,
    ChevronLeftIcon,
    ArrowRightIcon,
    CheckIcon,
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
      "copyResxDest",
      "moveResxSrcFormatted",
      "copyResxSrcFormatted",
      "moveResxDestFormatted",
      "copyResxDestFormatted",
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
      } else {
        return "";
      }
    },
    getSummaryMsg() {
      if (this.mode === "move") {
        return "You are moving a resource";
      } else {
        return "You are copying a resource";
      }
    },
  },
  props: ["handleComplete", "handlePrevious", "saving", "errored"],
  methods: {
    ...mapActions([
      "updateModalState",
      "clearMoveResx",
      "clearCopyResx",
      "skipToFinal",
      "updateMoveCopyMode",
    ]),
    handleNext() {
      this.handleComplete();
    },
    handleCancel() {
      this.updateModalState({
        state: false,
        componentToRender: "",
        title: "",
      });
    },
  },
};
</script>

<style lang="scss" src="./stage-three.scss" scoped />
