<template>
  <section class="stageone-wrapper">
    <header class="stageone-header">
        <!-- <span>Select the operation to proceed further</span> -->
      </header>
      <div class="move-copy-selection">
          <label for="move" :class="{selected: moveSelected}">
            <i class="move-copy-sel-ico-wrapper" v-if="moveSelected">
              <img src="../../assets/check.svg" alt="check">
            </i>
            <span>Move</span>
            <input type="radio" name="move-copy-radio" id="move" @click="handleSelection('move')">
          </label>
          <label for="copy" :class="{selected: copySelected}">
            <i class="move-copy-sel-ico-wrapper" v-if="copySelected">
              <img src="../../assets/check.svg" alt="check">
            </i>
            <span>Copy</span>
            <input type="radio" name="move-copy-radio" id="copy" @change="handleSelection('copy')">
          </label>
      </div>
      <div class="stage1-controls">
        <Button name="Next" :onClick="handleStepOne" :disabled="!isModeSelected" :buttonStyle="getStyle">
          <template slot="btn-icon">
            <img src="../../assets/angle-right-white.svg" alt="next" v-if="!isModeSelected">
            <img src="../../assets/angle-right.svg" alt="next" v-if="isModeSelected">
          </template>
        </Button>
        <Button name="Cancel" :onClick="dismissPopup">
          <template slot="btn-icon">
            <img src="../../assets/times.svg" alt="cancel">
          </template>
        </Button>
      </div>
  </section>
</template>

<script>
import TextBox from "../Form/TextBox";
import Button from "../Form/Button";
import Vue from "vue";
import { mapActions } from "vuex";

export default {
  name: "StageOne",
  components: {
    Button,
    TextBox,
  },
  props: ["handleNext"],
  data() {
    return {
      mode: "",
    };
  },
  computed: {
    moveSelected() {
      return this.mode === "move";
    },
    copySelected() {
      return this.mode === "copy";
    },
    isModeSelected() {
      return this.mode !== ""
    },
    getStyle() {
      if(!this.isModeSelected) {
        return "disabled"
      }
    }
  },
  methods: {
    ...mapActions(["updateModalState", "updateMoveCopyMode", "clearMoveResx"]),
    handleSelection(mode) {
      this.mode = mode;
      this.updateMoveCopyMode(mode);
    },
    dismissPopup() {
      this.updateModalState({
        status: false,
        componentToRender: "",
        title: "",
      });
      if(this.mode === "move") {
        this.clearMoveResx();
      }
    },
    handleStepOne() {
      this.handleNext();
    }
  }
}
</script>

<style lang="scss" src="./stage-one.scss" />
