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

<script>
import Vue from "vue";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import StageThree from "./StageThree";
import { mapActions, mapGetters } from "vuex";
import gql from "graphql-tag";
import CopyResxGQL from "../../graphql/copyResource.gql";
import MoveResxGQL from "../../graphql/moveResource.gql";

export default Vue.component("MoveCopy", {
  components: {
    StageOne,
    StageTwo,
    StageThree,
  },
  data() {
    return {
      stage: "one",
      saving: false,
      errored: false,
    };
  },
  beforeDestroy() {
    this.clearMoveCopyState();
  },
  methods: {
    ...mapActions([
      "clearMoveResx",
      "clearCopyResx",
      "updateModalState",
      "refetchData",
      "refreshFileExplorer",
      "updateModalTitle",
      "clearMoveCopyState",
      "closeModal",
      "addJob",
    ]),
    handleStepOne() {
      this.stage = "two";
      this.updateModalTitle(`${this.getMoveCopyMode} - select source`);
    },
    handleStepTwo() {
      this.stage = "three";
      this.updateModalTitle(`${this.getMoveCopyMode} - select destination`);
    },
    async handleCompletion() {
      this.saving = true;
      this.errored = false;

      try {
        if (this.getMoveCopyMode === "copy") {
          if (this.getBulkMode) {
            this.addJob({
              jobType: "COPY",
              data: {
                items: JSON.parse(JSON.stringify(this.getCopyResourceBulk)),
              },
            });
          } else {
            await this.$apollo.mutate({
              mutation: gql(CopyResxGQL),
              variables: {
                from_path: this.copyResxSrc,
                to_path: `${this.copyResxDest}/${this.copyResxSrc
                  .split("/")
                  .pop()}`,
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
                items: JSON.parse(JSON.stringify(this.getMoveResourceBulk)),
              },
            });
          } else {
            await this.$apollo.mutate({
              mutation: gql(MoveResxGQL),
              variables: {
                from_path: this.moveResxSrc,
                to_path: `${this.moveResxDest}/${this.moveResxSrc
                  .split("/")
                  .pop()}`,
              },
            });
          }
          this.saving = false;
          this.closeModal();
        }
      } catch (error) {
        console.log(error);
      }
    },
    navToStepOne() {
      this.stage = "one";
      if (this.getMoveCopyMode === "move") {
        this.clearMoveResx();
      } else {
        this.clearCopyResx();
      }
    },
    navToStepTwo() {
      this.stage = "two";
      if (this.getMoveCopyMode === "move") {
        this.clearMoveResx();
      } else {
        this.clearCopyResx();
      }
    },
  },
  computed: {
    mode() {
      return this.$store.getters.mvCopyMode;
    },
    ...mapGetters([
      "moveResxSrc",
      "moveResxDest",
      "copyResxSrc",
      "copyResxDest",
      "getSkipToFinal",
      "getMoveCopyMode",
      "getBulkMode",
      "getMoveResourceBulk",
      "getCopyResourceBulk",
      "getBulkItems",
    ]),
  },
});
</script>
