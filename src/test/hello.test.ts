import axios from "axios";
import { expect } from "chai";

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
