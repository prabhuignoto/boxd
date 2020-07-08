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
    input DeleteBulkArgs {
      paths: [String!]!
      uiJobId: String!
    }

    input ListFilesArg {
      limit: Int
      path: String!
      cursor: String
    }

    input CreateFolderArg {
      path: String!
      autorename: Boolean
      uiJobId: String!
      name: String!
    }

    input FilesRelocationArg {
      fromPath: String!
      toPath: String!
      autorename: Boolean
      uiJobId: String!
    }

    input Entry {
      formPath: String!
      toPath: String!
      id: String
    }

    input RelocationBulkArgs {
      autorename: Boolean
      uiJobId: String!
      entries: [Entry!]!
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
