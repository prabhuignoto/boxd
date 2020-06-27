<template>
  <div class="tree-view-wrapper">
    <!-- <header class="tree-view-header">
      <img
        src="../../assets/sitemap.svg"
        alt="explorer"
        class="file-explorer-icon"
      />
      <span>Explorer</span>
    </header> -->
    <div class="tree-view-content">
      <RootFolder :onClick="handleRootFolder" />
      <FileExplorer path="" />
    </div>
  </div>
</template>

<script lang="ts">
import RootFolder from "../rootFolder";
import FileExplorer from "./FileExplorer";
import { mapActions } from "vuex";

export default {
  components: {
    RootFolder,
    FileExplorer,
  },
  name: "TreeviewWrapper",
  methods: {
    ...mapActions(["updatePath"]),
    handleRootFolder() {
      this.updatePath("");
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-view-wrapper {
  align-items: flex-start;
  background: #fff;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 450px;
  overflow-x: auto;
  position: relative;

  @media (min-width: 768px) and (max-width: 1024px) {
    display: none;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
  @media only screen and (max-width: 480px) {
    display: none;
  }
  @media only screen and (max-width: 320px) {
    display: none;
  }

  .tree-view-content {
    margin-left: 0.5rem;
    margin-top: 1rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    width: 90%;
  }

  .file-explorer-icon {
    height: 1.5rem;
    margin-left: 1rem;
    margin-right: 0.25rem;
    width: 1.5rem;
  }
}

.tree-view-header {
  align-items: center;
  color: #2b2d42;
  display: flex;
  font-size: 1rem;
  font-weight: 500;
  font-weight: 700;
  justify-content: flex-start;
  margin: 0;
  margin-bottom: 1rem;
  padding: 0.4rem 0;
  position: relative;
  width: 100%;

  &::after {
    background: #c2c7c8;
    bottom: 0;
    content: "";
    height: 1px;
    left: 0;
    position: absolute;
    width: 100%;
  }

  span {
    padding: 0.5rem;
    text-align: left;
    width: 100%;
  }
}
</style>
