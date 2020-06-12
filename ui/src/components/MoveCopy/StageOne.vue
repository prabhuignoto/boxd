<template>
  <section class="stage-one-wrapper">
    <header class="stage-one-header">
      <!-- <span>Select the operation to proceed further</span> -->
    </header>
    <div class="move-copy-selection">
      <label for="move" :class="{selected: moveSelected}">
        <span>Move Files to a new Destination</span>
        <input type="radio" name="move-copy-radio" id="move" @click="handleSelection('move')" />
        <CheckIcon :style="{visibility: moveSelected ? 'visible' : 'hidden'}" />
      </label>
      <label for="copy" :class="{selected: copySelected}">
        <span>Copy Files to a new Destination</span>
        <input type="radio" name="move-copy-radio" id="copy" @change="handleSelection('copy')" />
        <CheckIcon :style="{visibility: copySelected ? 'visible' : 'hidden'}" />
      </label>
    </div>
    <div class="stage1-controls">
      <Button
        name="Next"
        :onClick="handleStepOne"
        :disabled="!isModeSelected"
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
import Button from "../Form/Button";
import Vue from "vue";
import { mapActions } from "vuex";
import { CheckIcon } from "vue-feather-icons";
import { ChevronRightIcon } from "vue-feather-icons";

export default {
  name: "StageOne",
  components: {
    Button,
    CheckIcon,
    ChevronRightIcon
  },
  props: ["handleNext"],
  data() {
    return {
      mode: ""
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
      return this.mode !== "";
    },
    getStyle() {
      if (!this.isModeSelected) {
        return "disabled";
      } else {
        return "";
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
        title: ""
      });
      if (this.mode === "move") {
        this.clearMoveResx();
      }
    },
    handleStepOne() {
      this.handleNext();
    }
  }
};
</script>

<style lang="scss" src="./stage-one.scss" scoped/>
