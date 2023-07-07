import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

// Create an ApolloClient instance
const apolloClient = new ApolloClient({
  // Replace `your-graphql-endpoint` with the actual GraphQL API endpoint URL
  uri: 'https://xapi.metatechcoin.org/',
});

// Install the Vue plugin
Vue.use(VueApollo);

// Create a new ApolloProvider instance
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export default apolloProvider;