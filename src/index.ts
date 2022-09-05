import "reflect-metadata";
import { AppDataSource } from "./data-source";

import { ApolloServer, gql } from "apollo-server";
import { User } from "./entity/User";

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
    birthDate: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    createUser(data: UserInput!): User
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello Word!",
  },
  Mutation: {
    createUser: async (parent, args) => {
      /^((?=\S*?[a-z,A-Z])(?=\S*?[0-9]).{6,})\S/.test(args.data.password) ||
        console.log(
          "A senha deve possuir ao menos 6 caracteres, com 1 letra e 1 numero"
          // ver como lançar erro como resposta
        );

      // const validationEmail =

      const user = new User();
      user.name = args.data.name;
      user.email = args.data.email;
      user.birthDate = args.data.birthDate;
      user.password = args.data.password;
      await AppDataSource.manager.save(user);

      return user;
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
