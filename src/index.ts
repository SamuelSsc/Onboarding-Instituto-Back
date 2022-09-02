import "reflect-metadata";
import { AppDataSource } from "./data-source";

import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: Int
    name: String!
    email: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    createUser(data: UserInput!): String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello Word!",
  },
  Mutation: {
    createUser: (parent, args) => {
      const data = { id: 1, name: args.data.name, email: args.data.email };
      return `Usuario criado ${data.name}`;
    },
  },
};

const port = 4000;
AppDataSource.initialize();
const app = new ApolloServer({ typeDefs, resolvers });
app
  .listen(port)
  .then(() => console.info(`Server executing on port ${port}`))
  .catch((error) => console.error(error));
