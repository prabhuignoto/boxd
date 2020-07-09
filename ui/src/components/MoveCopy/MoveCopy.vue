<template>
  <StageThree
    :handleComplete="handleCompletion"
    :mode="getMoveCopyMode"
    :saving="saving"
    :errored="errored"
    :bulkMode="isBulkModeEnabled"
  />
</template>

<script lang="ts">
import Vue from "vue";
import StageThree from "./StageThree.vue";

import { Component } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "MoveCopy",
  components: {
    StageThree,
  },
})
export default class extends Vue {
  stage = "one";
  saving = false;
  errored = false;

  @Action("updateModalTitle") updateModalTitle;
  @Action("clearMoveCopyState") clearMoveCopyState;
  @Action("closeModal") closeModal;
  @Action("addJob") addJob;
  @Action("disableBulkMode") disableBulkMode;

  @Getter("moveResxSrc") moveResxSrc: { path: string; id: string };
  @Getter("moveResxDest") moveResxDest: { path: string; id: string };
  @Getter("copyResxSrc") copyResxSrc: { path: string; id: string };
  @Getter("copyResxDest") copyResxDest: { path: string; id: string };
  @Getter("getMoveCopyMode") getMoveCopyMode: string;
  @Getter("isBulkModeEnabled") isBulkModeEnabled;
  @Getter("getMoveResourceBulk") getMoveResourceBulk;
  @Getter("getCopyResourceBulk") getCopyResourceBulk;

  beforeDestroy() {
    this.clearMoveCopyState();
    this.disableBulkMode();
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
        if (this.isBulkModeEnabled) {
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
        if (this.isBulkModeEnabled) {
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

  get mode() {
    return this.$store.getters.mvCopyMode;
  }
}
</script>
