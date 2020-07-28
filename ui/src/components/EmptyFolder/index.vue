<template>
  <div class="empty-message-wrapper">
    <span class="icon">
      <BoxIcon />
    </span>
    <span class="message">Drop your files here to upload.</span>
  </div>
</template>


<script>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BoxIcon } from "vue-feather-icons";

@Component({
  name: "EmptyMessage",
  components: {
    BoxIcon,
  },
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.empty-message-wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.icon {
  align-items: center;
  color: #ccc;
  display: flex;
  height: 2rem;
  width: 2rem;

  svg {
    height: 100%;
    width: 100%;
  }
}

.message {
  color: #ccc;
  font-size: 1.25rem;
  font-weight: 300;
  margin-left: 1rem;
}
</style>