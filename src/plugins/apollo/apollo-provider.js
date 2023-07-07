import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import VueApollo from 'vue-apollo';
import { FApolloClient } from './FApolloClient.js';

export const metatechFApolloClient = new FApolloClient({
    apolloProviders: [
        {
            http: 'https://xapi.metatechcoin.org/',
            // for subscriptions
            ws: '',
        },
    ],
    defaultProviderIndex: 'random',
});

export const testFApolloClient = new FApolloClient({
    apolloProviders: [{
        http: 'https://xapi.metatechcoin.org/'
    }],
    defaultProviderIndex: 'random',
});


export const metatechApolloClient = new ApolloClient({
    link: ApolloLink.from([
        metatechFApolloClient.getNetErrorLink(),
        metatechFApolloClient.getRetryLink(),
        metatechFApolloClient.getErrorLink(),
        metatechFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export const testApolloClient = new ApolloClient({
    link: ApolloLink.from([
        testFApolloClient.getNetErrorLink(),
        testFApolloClient.getRetryLink(),
        testFApolloClient.getErrorLink(),
        testFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});


Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    clients: {
        metatech: metatechApolloClient,
        test: testApolloClient,
    },
    defaultClient: testApolloClient,
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only', // 'cache-and-network', 'network-only', 'cache-first'
        },
    },
});
