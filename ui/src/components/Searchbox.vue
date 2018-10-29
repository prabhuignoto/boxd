<template>
  <div class="searchbox-wrapper">
    <input type="text" :value="term" name="searchbox" id="searchbox-main" placeholder="search..." @keypress="handleSearch">
    <div class="button-wrapper" v-if="term !== ''">
      <Button buttonStyle="icon" :onClick="handleClear">
        <template slot="btn-icon">
          <i>
            <img src="../assets/cancel.svg" alt="clear search">
          </i>
        </template>
      </Button>
    </div>
    <div class="search-loader-wrapper" v-if="$apollo.loading">
      <Loader />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import gql from "graphql-tag";
import SearchGQL from "../graphql/search.gql";
import Loader from "./Loader";
import Button from "./Form/Button";

export default {
  name: "SearchBox",
  components: {
    Loader,
    Button
  },
  data() {
    return {
      skipQuery: true,
      term: ""
    };
  },
  methods: {
    ...mapActions([
      "updateSearch",
      "updateSearchResults",
      "clearSearch",
      "clearList",
      "refetchData"
    ]),
    handleSearch({ keyCode, target }) {
      if (keyCode === 13 && target.value !== "") {
        this.term = target.value;
        this.skipQuery = false;
        this.clearList();
        this.$nextTick(() => {
          this.updateSearch(target.value);
        });
      }
    },
    handleClear() {
      this.skipQuery = true;
      this.term = "";
      this.clearSearch();
      this.refetchData(true);
    }
  },
  apollo: {
    search: {
      query: gql(SearchGQL),
      skip() {
        return this.skipQuery;
      },
      result({ loading, data }) {
        if (!loading && data && data.search) {
          this.updateSearchResults(data.search.matches.map(x => x.metadata));
        }
      },
      variables() {
        return {
          query: this.term
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.searchbox-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  input[type="text"] {
    width: 100%;
    height: 90%;
    border-radius: 5px;
    border: 1px solid #c2c7c8;
    padding: 0 0.75rem 0 0.5rem;
    outline: none;
    font-size: 1.2rem;
  }
  .search-loader-wrapper {
    position: absolute;
    right: 3.5rem;
    bottom: -0.75rem;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
  }
  .button-wrapper {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

