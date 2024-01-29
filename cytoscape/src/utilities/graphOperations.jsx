import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const ADD_NODE = gql`
  mutation AddNode($label: String!) {
    addNode(label: $label) {
      id
      label
    }
  }
`;

export const useAddNodeMutation = () => {
  return useMutation(ADD_NODE, { client });
};
