<template>
  <nav class="explorer-toolbar-wrapper">
    <ul class="explorer-toolbar">
      <li class="explorer-toolbar-item copy" title="Delete Selected">
        <i>
          <TrashIcon />
        </i>
      </li>
      <li class="explorer-toolbar-item trash" title="Copy Selected">
        <i>
          <CopyIcon />
        </i>
      </li>
      <li class="explorer-toolbar-item move" title="Move Selected">
        <i>
          <ArrowRightIcon />
        </i>
      </li>
    </ul>
  </nav>
</template>

<script>
import Vue from "vue";
import { TrashIcon, ArrowRightIcon, CopyIcon } from "vue-feather-icons";

export default Vue.extend({
  name: "ExplorerToolbar",
  components: {
    TrashIcon,
    ArrowRightIcon,
    CopyIcon,
  },
});
</script>

<style lang="scss" src="./explorer-toolbar.scss" scoped />
