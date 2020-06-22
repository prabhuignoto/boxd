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

<script>
import uniqid from "uniqid";

export default {
  name: "Textbox",
  props: ["name", "label", "onInput", "placeholder", "onEnter"],
  computed: {
    id() {
      return uniqid(name);
    },
  },
  methods: {
    handlKeyPress(ev) {
      if (ev.keyCode === 13) {
        this.onEnter && this.onEnter();
      }
    },
  },
};
</script>

<style lang="scss" src="./textbox.scss" scoped />
