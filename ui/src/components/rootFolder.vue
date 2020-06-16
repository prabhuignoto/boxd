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
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 0.95rem;
  justify-content: flex-start;

  margin-left: 0.25rem;
  margin-top: 0.5rem;

  width: 80px;
  &:focus {
    outline: 1px dotted #2b2d42;
    outline-offset: 2px;
  }
  i {
    width: 1.25rem;
    height: 1.25rem;
  }
  .root-slash {
    margin-left: 0.5rem;
  }
  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
