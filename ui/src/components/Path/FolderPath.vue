<template>
  <div class="path-wrapper">
    <ul class="path">
      <li class="path-item">
        <a href="javascript:void(0);" @click="navToHome($event)" v-bind:class="{'disabled selected': isHome()}">
          <span class="path-value home">
            <!-- <img src="../../assets/home.svg" alt="home"> -->
            <span>Home</span>
          </span>
        </a>
      </li>
      <li v-for="path in folderPath" :key="path" v-if="path !== ''" class="path-item">
        <a href="javascript:void(0);" v-bind:class="{'disabled selected': isCurrentDir(path)}"
            @click="handleNavigation(path, $event)">
           <span class="path-slash">/</span>
          <span class="path-value">{{path}}</span>
        </a>
      </li>
    </ul>
  </div>  
</template>

<script>
export default {
  name: "FolderPath",
  methods: {
    handleNavigation(path, $evt) {
      $evt.preventDefault();
      let pathArr = this.folderPath;
      const newPath = pathArr.slice(0, pathArr.indexOf(path) + 1).join("/");
      this.$store.dispatch("updatePath", newPath);
    },
    navToHome($evt) {
      $evt.preventDefault();
      this.$store.dispatch("updatePath", "");
    },
    isCurrentDir(path) {
      return this.folderPath[this.folderPath.length-1] === path;
    },
    isHome() {
      return this.$store.state.explorer.path === "";
    }
  },
  computed: {
    folderPath() {
      let path = this.$store.state.explorer.path;
      if(path) {
        return path.split("/");
      }
    }
  }
}
</script>

<style lang="scss" src="./folderpath.scss" />
