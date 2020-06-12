<template>
  <StageOne v-if="stage === 'one' && !getSkipToFinal"
    :handleNext="handleStepOne"/>
  <StageTwo v-else-if="stage === 'two' && !getSkipToFinal"
    :handleNext="handleStepTwo"
    :handlePrevious="navToStepOne"
    :mode="mode"
  />
  <StageThree v-else-if="stage === 'three' || getSkipToFinal"
    :handleComplete="handleCompletion"
    :handlePrevious="navToStepTwo"
    :mode="mode"
    :saving="saving"
    :errored="errored"
  />
</template>

<script>
// import TextBox from "../Form/TextBox";
import Button from "../Form/Button";
import Vue from "vue";
import StageOne from "./StageOne";
import StageTwo from "./StageTwo";
import StageThree from "./StageThree";
import { mapActions, mapGetters } from "vuex";
import gql from "graphql-tag";
import CopyResxGQL from "../../graphql/copyResource.gql";
import MoveResxGQL from "../../graphql/moveResource.gql";
import { setTimeout } from "timers";

export default Vue.component("MoveCopy", {
  components: {
    // TextBox,
    StageOne,
    StageTwo,
    StageThree
  },
  data() {
    return {
      stage: "one",
      saving: false,
      errored: false
    };
  },
  methods: {
    ...mapActions([
      "clearMoveResx",
      "clearCopyResx",
      "updateModalState",
      "refetchData",
      "refreshFileExplorer"
    ]),
    handleStepOne() {
      this.stage = "two";
    },
    handleStepTwo() {
      this.stage = "three";
    },
    handleCompletion() {
      this.saving = true;
      this.errored = false;
      if (this.mode === "copy") {
        let pathArray = this.copyResxSrc.split("/");
        let srcName = pathArray[pathArray.length - 1];
        this.$apollo
          .mutate({
            mutation: gql(CopyResxGQL),
            variables: {
              from_path: this.copyResxSrc,
              to_path: `${this.copyResxDest} / ${srcName}`
            },
            update: (store, data) => {}
          })
          .then(data => {
            this.updateModalState({
              status: false,
              componentToRender: "",
              title: ""
            });
            this.refreshFileExplorer({
              status: true,
              path: this.copyResxDest
            });
            this.saving = false;
          })
          .catch(error => {
            this.saving = false;
            this.errored = true;
          });
      } else if (this.mode === "move") {
        let pathArray = this.moveResxSrc.split("/");
        let srcName = pathArray[pathArray.length - 1];
        this.$apollo
          .mutate({
            mutation: gql(MoveResxGQL),
            variables: {
              from_path: this.moveResxSrc,
              to_path: `${this.moveResxDest}/${srcName}`
            },
            update: (store, data) => {
            }
          })
          .then(data => {
            this.saving = false;
            this.refetchData(true);
            this.updateModalState({
              status: false,
              componentToRender: "",
              title: ""
            });
            let srcPath = this.moveResxSrc.split("/");
            srcPath.pop();
            this.$nextTick(() => {
              this.refreshFileExplorer({
                status: true,
                path: this.moveResxDest
              });
              this.$nextTick(() => {
                this.refreshFileExplorer({
                  status: true,
                  path: srcPath.join(" / ")
                });
              })
            })
          })
          .catch(error => {
            this.saving = false;
            this.errored = true;
          });
      }
    },
    navToStepOne() {
      this.stage = "one";
      if (this.mode === "move") {
        this.clearMoveResx();
      } else {
        this.clearCopyResx();
      }
    },
    navToStepTwo() {
      this.stage = "two";
      if (this.mode === "move") {
        this.clearMoveResx();
      } else {
        this.clearCopyResx();
      }
    }
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
      "getSkipToFinal"
    ])
  }
});
</script>