<template>
  <div class="explorer-container">
    <div class="tree-view-wrapper">
      <header>
        <img src="../../assets/sitemap.svg" alt="explorer" class="file-explorer-icon">
        <span>File Explorer</span>
      </header>
      <div class="tree-view-content">
        <RootFolder :onClick="handleRootFolder" />
        <FileExplorer path="" />
      </div>
    </div>
    <!-- <FolderPath /> -->
    <div class="explorer">
      <header>
        <ul class="header-wrapper">
          <li v-for="header in headers" :key="header" v-bind:class="header">{{header}}</li>
          <li class="header empty">
          </li>
        </ul>
        <div class="ctx-control-container">
          <ContextControl :path="path"/>
        </div>
      </header>
      <section class="context-container">
        <!-- <ContextActions :path="path" /> -->
      </section>
      <section class="explorer-content">
        <div class="loader-container" v-if="$apollo.loading">
          <Loader size="large">
          </Loader>
        </div>
        <div class="line-item-wrapper" v-for="file in files.entries" :key="file.name" v-if="!$apollo.loading">
          <LineItem v-bind="file"/>
        </div>
        <div class="info-message" v-if="files.entries.length<1 && !$apollo.loading">
          <span>You have no folders or files here.</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import FolderPath from "../Path/FolderPath";
import FolderGQL from "../../graphql/folder.gql";
import Loader from "../Loader";
import FileExplorer from "../FileExplorer";
import LineItem from "./Explorer-LineItem";
import SearchBox from "../Searchbox";
import RootFolder from "../rootFolder";
import { mapActions } from "vuex";
import ContextControl from "../ContextActions/Control";

export default {
  name: "Explorer",
  components: {
    LineItem,
    FolderPath,
    Loader,
    SearchBox,
    FileExplorer,
    RootFolder,
    ContextControl
  },
  data() {
    return {
      files: [],
      headers: ["name", "size", "last modified"]
    };
  },
  computed: {
    path() {
      return this.$store.state.explorer.path;
    }
  },
  methods: {
    ...mapActions(["updatePath"]),
    handleRootFolder() {
      this.updatePath("");
    }
  },
  apollo: {
    files: {
      query: gql(FolderGQL),
      variables() {
        return {
          path: this.path
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.explorer-container {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}
.loader-container {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  height: 100%;
  width: 100%;
}
.explorer {
  background: #fff;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 100%;
  position: relative;
  .line-item-wrapper {
    &:nth-child(odd) {
      background: rgba(0, 0, 0, 0.02);
    }
  }
}
.explorer-content {
  min-height: 350px;
}
header {
  width: 100%;
  position: relative;
  .header-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    list-style-type: none;
    flex-direction: row;
    margin: 0;
    padding: 1.5rem 0;
    border-bottom: 2px solid #007ee5;

    li {
      text-transform: capitalize;
      font-size: 1rem;
      font-weight: bold;
      text-align: left;
      padding-left: 2.5rem;
      color: #007ee5;
      &.name {
        flex: 2;
      }
      &.size {
        flex: 1;
      }
      &.modified {
        flex: 1;
      }
      &.empty {
        flex: 1;
      }
    }
  }
}
.info-message {
  font-size: 1.75rem;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-left: auto;
  margin-right: auto;
  color: #c6c6c6;
}
.ctx-control-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.tree-view-wrapper {
  /* border: 1px solid rgba(0, 126, 229, 0.1); */
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-right: 1rem;
  padding: 0.25rem;
  /* background: rgba(0, 126, 229, 0.06); */
  header {
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 0.5rem;
    /* background: rgba(0, 126, 229, 0.1); */
    color: #007ee5;
    /* border-top-right-radius: 10px;
    border-top-left-radius: 10px; */
    span {
      padding: 0.5rem 0.5rem;
      width: 100%;
      text-align: left;
    }
  }
  .tree-view-content {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .file-explorer-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 1rem;
    margin-right: 0.25rem;
  }
}
</style>


