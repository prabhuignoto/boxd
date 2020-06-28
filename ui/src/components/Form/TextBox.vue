<template>
  <div class="textbox-wrapper">
    <label :for="id">{{ label }}</label>
    <input
      type="text"
      :name="name"
      :id="id"
      @input="onInput"
      @keypress="handlKeyPress"
      :placeholder="placeholder"
    />
  </div>
</template>

<script lang="ts">
import uniqid from "uniqid";
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";

@Component({
  name: "Textbox",
})
export default class extends Vue {
  @Prop() name;
  @Prop() label;
  @Prop() onInput;
  @Prop() placeholder;
  @Prop() onEnter;

  get id() {
    return uniqid(name);
  }
  handlKeyPress(ev) {
    if (ev.keyCode === 13) {
      this.onEnter && this.onEnter();
    }
  }
}
</script>

<style lang="scss" src="./textbox.scss" scoped />
