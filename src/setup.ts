import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./schema";
import { createConnection } from "./data-source";

async function setupServer() {
  const port = 4000;

  const app = new ApolloServer({ typeDefs, resolvers });
  await app.listen(port);
  console.info(`Server executing on port ${port}`);
}

async function setupConnection() {
  console.log("Starting conect DB!");
  await createConnection();
  console.log("Conected...!");
}

export async function setup() {
  await setupConnection();
  await setupServer();
}
