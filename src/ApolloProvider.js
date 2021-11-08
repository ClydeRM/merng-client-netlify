import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";

// Link to gql server
const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

// Use authorization token in header
// Work like a middleware to handle requests package
// setContext((req, previous_context) => {...} ), req is requests package, previous_context is forwarding to next middleware
// In the case , we don't need to setting detail, so leave it empty
const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// Create ApolloClient
const client = new ApolloClient({
  link: authLink.concat(httpLink), // httpLink is a string array, concat the headers setting string in original string array
  cache: new InMemoryCache(), // 4:00:00 direct access client cache
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
