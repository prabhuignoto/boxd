<template>
  <div class="textbox-wrapper">
    <label :for="id">{{label}}</label>
    <input type="text"
      :name="name"
      :id="id"
      @input="onInput"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
import uniqid from "uniqid";

export default {
  name: "Textbox",
  props: ["name", "label", "onInput", "placeholder"],
  computed: {
    id() {
      return uniqid(name);
    }
  }
}
</script>

<style lang="scss" src="./textbox.scss" scoped/>
