import './App.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
    uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('id_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Setup our client to execute the `authlink` middleware prior to making the request to our GraphQL API
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            User: {
                fields: {
                    savedBooks: {
                        merge: false,
                    },
                },
            },
        },
    }),
})

function App() {
    return (
        <>
            <ApolloProvider client={client}>
                <Navbar />
                <Outlet />
            </ApolloProvider>
        </>
    );
}

export default App;
