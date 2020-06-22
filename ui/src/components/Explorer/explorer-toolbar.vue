<template>
  <nav class="explorer-toolbar-wrapper">
    <ul class="explorer-toolbar">
      <li class="explorer-toolbar-item context" title="Quick Actions">
        <ContextControl :path="getExplorerPath" type="link" name="Random" />
      </li>
      <li
        class="explorer-toolbar-item copy"
        title="Delete Selected"
        @click="handleBulkDelete"
        v-if="getBulkItems.length"
      >
        <i>
          <TrashIcon />
        </i>
      </li>
      <li
        class="explorer-toolbar-item trash"
        title="Copy Selected"
        v-if="getBulkItems.length"
        @click="handleBulkCopy"
      >
        <i>
          <CopyIcon />
        </i>
      </li>
      <li
        class="explorer-toolbar-item move"
        title="Move Selected"
        v-if="getBulkItems.length"
        @click="handleBulkMove"
      >
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
import { mapGetters, mapActions } from "vuex";

import ContextControl from "../ContextActions/Control.vue";

export default Vue.extend({
  name: "ExplorerToolbar",
  components: {
    TrashIcon,
    ArrowRightIcon,
    CopyIcon,
    ContextControl,
  },
  computed: {
    ...mapGetters(["getBulkItems", "getBulkItems", "getExplorerPath"]),
  },
  methods: {
    ...mapActions([
      "enableBulkMode",
      "skipToFinal",
      "updateModalState",
      "setMoveResxBulk",
      "updateMoveCopyMode",
      "addJob",
    ]),
    handleBulkDelete() {
      this.addJob({
        jobType: "DELETE",
        data: {
          items: JSON.parse(JSON.stringify(this.getBulkItems)),
        },
      });
    },
    handleBulkCopy() {
      this.updateMoveCopyMode("copy");
      this.enableBulkMode(true);

      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: `Copying files`,
        width: 480,
      });
    },
    handleBulkMove() {
      this.updateMoveCopyMode("move");
      this.enableBulkMode(true);

      this.skipToFinal(true);
      this.updateModalState({
        status: true,
        componentToRender: "MoveCopy",
        title: `Moving files`,
        width: 480,
      });
    },
  },
});
</script>

<style lang="scss" src="./explorer-toolbar.scss" scoped />
