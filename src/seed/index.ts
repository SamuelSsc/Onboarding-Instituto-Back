import { createConnection } from "../data-source";
import { usersSeed } from "./users.seed";

async function generateSeed() {
  await createConnection();
  await usersSeed();
}

generateSeed();
