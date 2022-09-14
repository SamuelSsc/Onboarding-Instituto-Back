import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import { AppDataSource } from "./data-source";
import { resolvers, typeDefs } from "./schema";

export async function setupServer() {
  const port = 4000;
  AppDataSource.initialize();

  const app = new ApolloServer({ typeDefs, resolvers });
  await app.listen(port);
  console.info(`Server executing on port ${port}`);
}
