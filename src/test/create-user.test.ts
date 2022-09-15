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
    email: "SamuelTeste@gmail.com",
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

    const expectedResponse = {
      data: {
        createUser: {
          id: 2,
          email: "SamuelTeste@gmail.com",
          name: "Samuel Teste passando os dados",
          birthDate: "21/02/2002",
        },
      },
    };
    expect(response.status).to.equal(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
