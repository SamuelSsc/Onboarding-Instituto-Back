import * as dotenv from "dotenv";
import { setupServer } from "../setup";

dotenv.config({ path: __dirname + "/../../test.env" });

before(async () => {
  await setupServer();
});

require("./hello.test");
