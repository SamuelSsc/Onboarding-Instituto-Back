import axios from "axios";
import * as dotenv from "dotenv";
import { setupServer } from "../setup";
import { expect } from "chai";

dotenv.config({ path: __dirname + "/../../test.env" });

before(async () => {
  await setupServer();
});

describe("Query hello", () => {
  const EXPECTED_RESPONSE = { data: { hello: "Hello Word!" } };
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
    expect(response.status).to.equal(200);
    expect(response.data).to.be.deep.eq(EXPECTED_RESPONSE);
  });
});
