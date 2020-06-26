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
    this.clearMoveCopyState();
    this.skipToFinal(false);
    this.updateMoveCopyMode(null);
  },
  computed: {
    ...mapGetters([
      "getSkipToFinal",
      "getMoveCopyMode",
      "moveResxSrc",
      "copyResxSrc",
      "moveResxDest",
      "copyResxDest",
      "moveResxSrcFormatted",
      "copyResxSrcFormatted",
      "moveResxDestFormatted",
      "copyResxDestFormatted",
      "getBulkMode",
    ]),
    src() {
      if (this.getMoveCopyMode === "move") {
        return this.moveResxSrc;
      } else {
        return this.copyResxSrc;
      }
    },
    dest() {
      if (this.getMoveCopyMode === "move") {
        return this.moveResxDest;
      } else {
        return this.copyResxDest;
      }
    },
    canFinish() {
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
    },
    getStyle() {
      if (!this.canFinish || this.saving) {
        return "disabled xl";
      } else {
        return "xl";
      }
    },
    getSummaryMsg() {
      if (this.getMoveCopyMode === "move") {
        return "You are moving a resource";
      } else {
        return "You are copying a resource";
      }
    },
  },
  props: ["handleComplete", "handlePrevious", "saving", "errored", "bulkMode"],
  methods: {
    ...mapActions([
      "updateModalState",
      "skipToFinal",
      "updateMoveCopyMode",
      "clearMoveCopyState",
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
