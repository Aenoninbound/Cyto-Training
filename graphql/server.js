//server.js my backend 
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const nodes = [
  { id: 'a', label: 'Node A' },
  { id: 'b', label: 'Node B' },
  { id: 'c', label: 'Node C' },
];

const edges = [
  { id: 'ab', source: 'a', target: 'b', label: 'connectsTo' },
];

const typeDefs = gql`
  type Node {
    id: ID!
    label: String!
  }

  type Edge {
    id: ID!
    source: ID!
    target: ID!
    label: String!
  }

  type Query {
    nodes: [Node]
    edges: [Edge]
  }

  type Mutation {
    addNode(label: String!): Node
  }
`;

const resolvers = {
  Query: {
    nodes: () => nodes,
    edges: () => edges,
  },
  Mutation: {
    addNode: (_, { label }) => {
      const newNode = { id: `newNode${nodes.length + 1}`, label };
      nodes.push(newNode);
      return newNode;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
};

startServer().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
