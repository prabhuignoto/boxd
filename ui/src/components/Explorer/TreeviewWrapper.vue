<template>
  <div class="tree-view-wrapper">
    <header class="tree-view-header">
      <img src="../../assets/sitemap.svg" alt="explorer" class="file-explorer-icon">
      <span>Explorer</span>
    </header>
    <div class="tree-view-content"> 
      <RootFolder :onClick="handleRootFolder" />
      <FileExplorer path="" />
    </div>
  </div>
</template>

<script>
import RootFolder from "../rootFolder";
import FileExplorer from "./FileExplorer";
import Button from "../Form/Button";
import { mapActions } from "vuex";

export default {
  components: {
    RootFolder,
    FileExplorer,
    Button
  },
  name: "TreeviewWrapper",
  methods: {
    ...mapActions(["updatePath"]),
    handleRootFolder() {
      this.updatePath("");
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-view-wrapper {
  align-items: flex-start;
  background: #fff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  .tree-view-header {
    align-items: center;
    color: #2b2d42;
    display: flex;
    font-size: 1rem;
    font-weight: 500;
    font-weight: 700;
    justify-content: flex-start;
    margin-bottom: 1rem;
    margin: 0;
    padding: 0.4rem 0;
    position: relative;
    width: 100%;

    &::after {
      background: #c2c7c8;
      bottom: 0rem;
      content: "";
      height: 1px;
      left: 0;
      position: absolute;
      width: 90%;
    }
    span {
      padding: 0.5rem 0.5rem;
      width: 100%;
      text-align: left;
    }
  }
  .tree-view-content {
    margin-left: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    width: 90%;
    margin-top: 1rem;
  }
  .file-explorer-icon {
    height: 1.5rem;
    margin-left: 1rem;
    margin-right: 0.25rem;
    width: 1.5rem;
  }
}
</style>
