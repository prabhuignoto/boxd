<template>
  <nav class="explorer-toolbar-wrapper">
    <ul class="explorer-toolbar" :class="{ disabled: getBulkOpActive }">
      <li
        class="explorer-toolbar-item copy"
        title="Delete Selected"
        @click="handleBulkDelete()"
      >
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
import deleteBulkGQL from "../../graphql/deleteBulk.gql";
import gql from "graphql-tag";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  name: "ExplorerToolbar",
  components: {
    TrashIcon,
    ArrowRightIcon,
    CopyIcon,
  },
  computed: {
    ...mapGetters(["getBulkItems", "getBulkOpActive"]),
  },
  methods: {
    ...mapActions(["markItemsForBulkOp"]),
    handleBulkDelete() {
      this.markItemsForBulkOp("delete");
      this.$apollo.mutate({
        mutation: gql(deleteBulkGQL),
        variables: {
          options: {
            paths: this.getBulkItems.map(p => p.path_lower),
          },
        },
        update() {
          debugger;
        },
      });
    },
  },
});
</script>

<style lang="scss" src="./explorer-toolbar.scss" scoped />
