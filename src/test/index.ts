import { AppDataSource } from "../data-source";
import { setup } from "../setup";

before(async () => {
  await setup();
});

after(async () => {
  await AppDataSource.destroy();
  console.info("Connection to database closed!");
});

require("./hello.test");
require("./create-user.test");
