<template>
  <div class="searchbox-wrapper">
    <input
      type="text"
      :value="term"
      name="searchbox"
      id="searchbox-main"
      placeholder="search..."
      @keypress="handleSearch"
    />
    <div class="button-wrapper" v-if="term !== ''">
      <Button buttonStyle="icon" :onClick="handleClear">
        <template slot="btn-icon">
          <img src="../assets/cancel.svg" alt="clear search" />
        </template>
      </Button>
    </div>
    <div class="search-loader-wrapper" v-if="$apollo.loading">
      <Loader />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import gql from "graphql-tag";
import SearchGQL from "../graphql/search.gql";
import Loader from "./Loader";
import Button from "./Form/Button";

export default {
  name: "SearchBox",
  components: {
    Loader,
    Button,
  },
  data() {
    return {
      skipQuery: true,
      term: "",
    };
  },
  methods: {
    ...mapActions(["updateSearch", "clearSearch", "clearList", "refetchData"]),
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
    },
  },
  apollo: {
    search: {
      query: gql(SearchGQL),
      skip() {
        return this.skipQuery;
      },
      result({ loading, data }) {
        if (!loading && data && data.search) {
          // this.updateSearchResults(data.search.matches.map(x => x.metadata));
        }
      },
      variables() {
        return {
          query: this.term,
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.searchbox-wrapper {
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  position: relative;
  width: 100%;

  input {
    background: transparent;
    border: 0;
    border-bottom: 1px solid #fff;
    font-family: Nunito, Arial, Helvetica, sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    height: 100%;
    outline: none;
    width: 100%;
  }

  .search-loader-wrapper {
    bottom: -0.75rem;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    right: 3.5rem;
    right: 0;
  }

  .button-wrapper {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  button {
    height: 1.85rem;
    width: 1.85rem;
  }

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
