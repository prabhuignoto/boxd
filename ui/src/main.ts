import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import Vue from "vue";
import VueApollo from "vue-apollo";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = true;

const httpLink = new HttpLink({
  credentials: "include",
  uri: `${process.env.VUE_APP_API_SERVER}/graphql`,
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  typeDefs: gql`
    input deleteBulkOptions {
      paths: [String!]!
      uiJobId: String!
    }

    input relocationEntry {
      fromPath: String!
      toPath: String!
      is: String!
    }

    input relocationOptions {
      entries: [relocationEntry!]!
      autorename: Boolean
      uiJobId: String!
    }
  `,
  connectToDevTools: true,
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      fetchPolicy: "cache-and-network",
    },
  },
});

Vue.use(VueApollo);

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount("#app");
