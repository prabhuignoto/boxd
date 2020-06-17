<template>
  <div class="root-folder" @click="onClick" tabindex="0">
    <i>
      <FolderIcon />
    </i>
    <span class="root-slash">Home</span>
  </div>
</template>

<script>
import { FolderIcon } from "vue-feather-icons";
import Vue from "vue";

export default Vue.extend({
  name: "RootFolder",
  props: ["onClick"],
  components: {
    FolderIcon,
  },
});
</script>

<style lang="scss" scoped>
.root-folder {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-family: Open Sans, Arial, Helvetica, sans-serif;
  font-size: 0.85rem;
  justify-content: flex-start;
  padding: 0.2rem 0;
  padding-left: 0.25rem;
  user-select: none;
  width: 4.5rem;
  color: #191919;

  &:focus {
    background: #efefef;
    border-radius: 0.2rem;
    outline: 0;
  }

  i {
    color: #007ee5;
    height: 1.25rem;
    width: 1.25rem;
  }

  .root-slash {
    margin-left: 0.25rem;
  }

  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
