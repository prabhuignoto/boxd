import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import { split } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import VueApollo from "vue-apollo";
import { getMainDefinition } from "apollo-utilities";

Vue.config.productionTip = true;
console.log(process.env);

const httpLink = new HttpLink({
  credentials: "include",
  uri: `${process.env.VUE_APP_API_SERVER}/graphql`
});

const wsLink = new WebSocketLink({
  uri: `${process.env.VUE_APP_WS_API_SERVER}/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      fetchPolicy: "cache-and-network"
    }
  }
});

Vue.use(VueApollo);

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
