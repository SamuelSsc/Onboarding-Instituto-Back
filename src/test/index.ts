import axios from "axios";
import { setupServer } from "../setup";

before(async () => {
  await setupServer();
});

describe("Query hello", () => {
  it("should return hello word", async () => {
    const query = `
        query Hello {
          hello
        }
      `;

    const response = await axios.post("http://localhost:4000/graphql", {
      query,
    });
    console.log(response.data);
  });
});
