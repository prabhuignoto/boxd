import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";
import Vue from "vue";
import VueApollo from "vue-apollo";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = true;
console.log(process.env);

const httpLink = new HttpLink({
  credentials: "include",
  uri: `${process.env.VUE_APP_API_SERVER}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `${process.env.VUE_APP_WS_API_SERVER}/graphql`,
  options: {
    reconnect: true,
    timeout: 30000,
    inactivityTimeout: 0,
  },
});

const link = split(
  ({ query }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { kind, operation }: any = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: link,
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
