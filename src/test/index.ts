import { setupServer } from "../setup";

before(async () => {
  await setupServer();
});

describe("Query hello", () => {
  it("should return hello word", async () => {
    console.log("Iniciou o teste, testando...");
  });
});
