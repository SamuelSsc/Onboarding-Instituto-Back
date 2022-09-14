import * as dotenv from "dotenv";
import { setup } from "../setup";

dotenv.config({ path: __dirname + "/../../test.env" });

before(async () => {
  await setup();
});

require("./hello.test");
