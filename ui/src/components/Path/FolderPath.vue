<template>
  <div class="path-wrapper">
    <ul class="path">
      <li class="path-item">
        <a href="javascript:void(0);" @click="navToHome($event)" v-bind:class="{'disabled selected': isHome()}">
          <span class="path-value home">
            <img src="../../assets/home.svg" alt="home">
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

<style lang="scss" scoped>
  .path-wrapper {
    background: rgba(0, 126, 229, 0.1);
    border: 1px solid rgba(0, 126, 229, 0.2);
    border-radius: 25px;
    padding: 0.25rem 0.5rem;
    .path {
      list-style-type: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin:0;
      padding: 0.1rem;
    }
    .path-slash {
      margin: 0 0.25rem;
      color: #007ee5;
    }
    .path-item {
      text-transform: capitalize;
      font-size: 0.9rem;
      font-weight: bold;
      a {
        text-decoration: none;
        color: #007ee5;
        .path-value {
          padding: 0.25rem 0.25rem;
        }
        &.disabled {
          pointer-events: none;
          color: #000;
        }
        &.selected {
          .path-value {
            border-radius: 4px;
            color: rgba(0,0,0,1);
          }
        }
      }
    }
    .home {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.25rem;
      }
    }
  }
</style>

