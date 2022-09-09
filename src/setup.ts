import { ApolloServer, gql } from "apollo-server";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as bcrypt from "bcrypt";

export async function setupServer() {
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
        if (
          !/^((?=\S*?[a-z,A-Z])(?=\S*?[0-9]).{6,})\S/.test(args.data.password)
        )
          throw new Error(
            "A senha deve possuir ao menos 6 caracteres, com 1 letra e 1 numero"
          );

        const isEmailAlreadyExist = await AppDataSource.manager.findBy(User, {
          email: args.data.email,
        });
        if (isEmailAlreadyExist.length > 0)
          throw new Error("Este email já esta cadastrado");

        const SALT_ROUNDS = 10;
        const passwordHashed = await bcrypt.hash(
          args.data.password,
          SALT_ROUNDS
        );

        const user = new User();
        user.name = args.data.name;
        user.email = args.data.email;
        user.birthDate = args.data.birthDate;
        user.password = passwordHashed;
        await AppDataSource.manager.save(user);

        return user;
      },
    },
  };

  const port = 4000;
  AppDataSource.initialize();

  const app = new ApolloServer({ typeDefs, resolvers });
  await app.listen(port);
  console.info(`Server executing on port ${port}`);
}
