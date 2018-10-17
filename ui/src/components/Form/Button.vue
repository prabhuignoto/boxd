<template>
  <button @click="onClick" :class="getDefaultStyle">
    <i v-if="buttonStyle !== 'link'">
      <slot name="btn-icon"></slot>
    </i>
    <span>{{name}}</span>
    <slot name="menu"></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["name", "onClick", "msize", "buttonStyle", "marginLess"],
  computed: {
    getDefaultStyle() {
      return {
        [this.msize]: true,
        [this.marginLess]: true,
        [this.buttonStyle ? this.buttonStyle : "default"]: true
      };
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  background: #007ee5;
  color: #fff;
  border: 2px solid #007ee5;
  border-radius: 3px;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  outline: none;
  margin: 0 0.25rem;
  display: flex;
  align-items: center;
  position: relative;

  &.default {
    padding: 0.5rem 0.75rem;
  }
  &.rounded {
    border-radius: 25px;
    padding: 0.5rem 0.75rem;
  }
  &.link {
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.95rem;
    color: #007ee5;
    border: none;
    background: none;
    text-decoration: underline;
  }
  &.disabled {
    padding: 0.5rem 0.75rem;
    background: #ddd;
    border: 2px solid #ddd;
    color: rgba(0, 0, 0, 0.5);
    cursor: auto;
  }
  &.icon {
    padding: 0.1rem;
    margin: 0;
    background: transparent;
    i {
      width: 1rem;
      height: 1rem;
      margin-right: 0rem;
    }
    &.large {
      border: none;
      i {
        width: 2rem;
        height: 2rem;
      }
    }
  }
  &.large {
    font-size: 0.95rem;
  }
  &.danger {
    padding: 0.5rem 0.75rem;
    background: #cb2431;
    color: #fff;
    border: 1px solid #cb2431;
  }
  i {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
}
</style>
