'use client';

import { ROUTES } from '@/constants/routes';
import { ApolloClient, InMemoryCache, ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

interface ApolloProviderProps {
  children: ReactNode;
}

const client = new ApolloClient({
  uri: ROUTES.API.GRAPHQL,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    },
  },
});

export function ApolloProvider({ children }: ApolloProviderProps) {
  return (
    <BaseApolloProvider client={client}>
      {children}
    </BaseApolloProvider>
  );
}