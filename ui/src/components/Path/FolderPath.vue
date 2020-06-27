<template>
  <div class="path-wrapper">
    <ul class="path">
      <li v-for="path in folderPath" :key="path" class="path-item">
        <a
          href="javascript:void(0);"
          v-bind:class="{
            'disabled selected': isCurrentDir(path),
            'path-link': true,
          }"
          @click="handleNavigation(path, $event)"
        >
          <span class="path-value">{{ path ? path : "home" }}</span>
          <span class="path-slash" v-show="!isCurrentDir(path)">
            /
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { mapActions } from "vuex";
import Vue from "vue";

export default Vue.extend({
  name: "FolderPath",
  methods: {
    ...mapActions(["clearList", "updatePath", "clearAllBulk"]),
    handleNavigation(path, $evt) {
      $evt.preventDefault();
      const pathArr = this.folderPath;
      const newPath = pathArr.slice(0, pathArr.indexOf(path) + 1).join("/");
      this.clearAllBulk();
      this.clearList();
      this.updatePath(newPath);
    },
    navToHome($evt) {
      $evt.preventDefault();
      this.clearList();
      this.$store.dispatch("updatePath", "");
    },
    isCurrentDir(path) {
      return this.folderPath[this.folderPath.length - 1] === path;
    },
    isHome() {
      return this.$store.state.explorer.path === "";
    },
  },
  computed: {
    folderPath() {
      const path = this.$store.state.explorer.path;
      if (path) {
        return path.split("/");
      } else {
        return "";
      }
    },
  },
});
</script>

<style lang="scss" src="./folderpath.scss" scoped />
