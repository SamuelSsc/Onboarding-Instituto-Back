import axios from "axios";
import { expect } from "chai";

describe("Mutation createUser", () => {
  const mutation = `mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
          id
          email
          name
          birthDate
        }
      }
      `;

  const VARIABLES = {
    name: "Samuel Teste passando os dados",
    email: "SamuelTeste12@gmail.com",
    birthDate: "21/02/2002",
    password: "1234qwer",
  };

  it("should return createUser", async () => {
    const urlDB = "http://localhost:4000/graphql";

    const response = await axios.post(urlDB, {
      variables: {
        data: VARIABLES,
      },
      query: mutation,
    });

    console.log(response.data, response.status);
    expect(response.status).to.equal(200);
    // expect(response.data).to.be.deep.eq(EXPECTED_RESPONSE);
  });
});
