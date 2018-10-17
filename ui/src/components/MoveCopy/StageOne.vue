<template>
  <section class="stageone-wrapper">
    <header>
        <span>Select the operation to proceed further</span>
      </header>
      <div class="move-copy-selection">
          <label for="move" :class="{selected: moveSelected}">
            <i class="move-copy-sel-ico-wrapper" v-if="moveSelected">
              <img src="../../assets/check-blue.svg" alt="check">
            </i>
            <span>Move</span>
            <input type="radio" name="move-copy-radio" id="move" @click="handleSelection('move')">
          </label>
          <label for="copy" :class="{selected: copySelected}">
            <i class="move-copy-sel-ico-wrapper" v-if="copySelected">
              <img src="../../assets/check-blue.svg" alt="check">
            </i>
            <span>Copy</span>
            <input type="radio" name="move-copy-radio" id="copy" @change="handleSelection('copy')">
          </label>
      </div>
      <div class="stage1-controls">
        <Button name="Next" :onClick="handleStepOne" :disabled="!isModeSelected" :buttonStyle="getStyle">
          <template slot="btn-icon">
            <img src="../../assets/angle-right.svg" alt="next">
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

<style lang="scss" scoped>
.stageone-wrapper {
  width: 100%;
}
.move-copy-container {
  width: 100%;
}

header {
  width: 100%;
  text-align: left;
  margin: 1.5rem;
  span {
    font-size: 1rem;
    font-weight: bold;
  }
}

.stage1-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin: 5rem 0 0.5rem 0;
}

img {
  max-height: 100%;
  max-width: 100%;
}
.move-copy-selection {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  label {
    padding: 0.75rem;
    border-radius: 4px;
    height: 100%;
    flex: 1;
    margin: 0 1rem;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    border-radius: 4px;
    border: 2px solid #ddd;

    &.selected {
      border: 2px solid #007ee5;
      color: #007ee5;
      background: #fff;
    }

    i {
      width: 1.25rem;
      height: 1.25rem;
      margin-right: 0.25rem;
    }
  }
  input[type="radio"] {
    display: none;
  }
}
</style>
