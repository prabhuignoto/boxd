<template>
  <StageOne
    v-if="stage === 'one' && !getSkipToFinal"
    :handleNext="handleStepOne"
  />
  <StageTwo
    v-else-if="stage === 'two' && !getSkipToFinal"
    :handleNext="handleStepTwo"
    :handlePrevious="navToStepOne"
    :mode="getMoveCopyMode"
  />
  <StageThree
    v-else-if="stage === 'three' || getSkipToFinal"
    :handleComplete="handleCompletion"
    :handlePrevious="navToStepTwo"
    :mode="getMoveCopyMode"
    :saving="saving"
    :errored="errored"
    :bulkMode="getBulkMode"
  />
</template>

<script lang="ts">
import Vue from "vue";
import StageOne from "./StageOne.vue";
import StageTwo from "./StageTwo.vue";
import StageThree from "./StageThree.vue";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "MoveCopy",
  components: {
    StageOne,
    StageTwo,
    StageThree,
  },
})
export default class extends Vue {
  stage = "one";
  saving = false;
  errored = false;

  @Action("clearMoveResx") clearMoveResx;
  @Action("clearCopyResx") clearCopyResx;
  @Action("updateModalState") updateModalState;
  @Action("refreshFileExplorer") refreshFileExplorer;
  @Action("updateModalTitle") updateModalTitle;
  @Action("clearMoveCopyState") clearMoveCopyState;
  @Action("closeModal") closeModal;
  @Action("addJob") addJob;

  @Getter("moveResxSrc") moveResxSrc: { path: string; id: string };
  @Getter("moveResxDest") moveResxDest: { path: string; id: string };
  @Getter("copyResxSrc") copyResxSrc: { path: string; id: string };
  @Getter("copyResxDest") copyResxDest: { path: string; id: string };
  @Getter("getSkipToFinal") getSkipToFinal: boolean;
  @Getter("getMoveCopyMode") getMoveCopyMode: string;
  @Getter("getBulkMode") getBulkMode;
  @Getter("getMoveResourceBulk") getMoveResourceBulk;
  @Getter("getCopyResourceBulk") getCopyResourceBulk;
  @Getter("getBulkItems") getBulkItems;

  beforeDestroy() {
    this.clearMoveCopyState();
  }

  handleStepOne() {
    this.stage = "two";
    this.updateModalTitle(`${this.getMoveCopyMode} - select source`);
  }

  handleStepTwo() {
    this.stage = "three";
    this.updateModalTitle(`${this.getMoveCopyMode} - select destination`);
  }

  async handleCompletion() {
    this.saving = true;
    this.errored = false;

    try {
      if (this.getMoveCopyMode === "copy") {
        if (this.getBulkMode) {
          this.addJob({
            jobType: "COPY",
            data: {
              items: this.getCopyResourceBulk,
              treeId: "explorer-main",
            },
          });
        } else {
          this.addJob({
            jobType: "COPY",
            data: {
              items: [
                {
                  fromPath: this.copyResxSrc.path,
                  toPath: `${
                    this.copyResxDest.path
                  }/${this.copyResxSrc.path.split("/").pop()}`,
                  id: this.copyResxSrc.id,
                },
              ],
              treeId: "explorer-main",
            },
          });
        }
        this.closeModal();
        this.saving = false;
      } else if (this.getMoveCopyMode === "move") {
        if (this.getBulkMode) {
          this.addJob({
            jobType: "MOVE",
            data: {
              items: this.getMoveResourceBulk,
              treeId: "explorer-main",
            },
          });
        } else {
          this.addJob({
            jobType: "MOVE",
            data: {
              items: [
                {
                  fromPath: this.moveResxSrc.path,
                  toPath: `${
                    this.moveResxDest.path
                  }/${this.moveResxSrc.path.split("/").pop()}`,
                  id: this.moveResxSrc.id,
                },
              ],
              treeId: "explorer-main",
            },
          });
        }
        this.saving = false;
        this.closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  navToStepOne() {
    this.stage = "one";
    if (this.getMoveCopyMode === "move") {
      this.clearMoveResx();
    } else {
      this.clearCopyResx();
    }
  }

  navToStepTwo() {
    this.stage = "two";
    if (this.getMoveCopyMode === "move") {
      this.clearMoveResx();
    } else {
      this.clearCopyResx();
    }
  }

  get mode() {
    return this.$store.getters.mvCopyMode;
  }
}
</script>
