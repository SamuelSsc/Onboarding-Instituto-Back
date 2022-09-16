import axios from "axios";
import { expect } from "chai";
import { dataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

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

  const USER_INPUT = {
    name: "testando buscar os dados",
    email: "SamuelTeste@gmail.com",
    birthDate: "21/02/2002",
    password: "1234qwer",
  };

  it("should return createUser", async () => {
    const urlDB = "http://localhost:4000/graphql";

    const response = await axios.post(urlDB, {
      variables: {
        data: USER_INPUT,
      },
      query: mutation,
    });
    const userCreated = await dataSource.findOneBy(User, {
      email: USER_INPUT.email,
    });
    const passwordCompare = await bcrypt.compare(
      USER_INPUT.password,
      userCreated.password
    );

    const expectedResponse = {
      data: {
        createUser: {
          id: userCreated.id,
          email: "SamuelTeste@gmail.com",
          name: "testando buscar os dados",
          birthDate: "21/02/2002",
        },
      },
    };
    expect(response.status).to.equal(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(userCreated.name).to.be.deep.eq(USER_INPUT.name);
    expect(userCreated.email).to.be.deep.eq(USER_INPUT.email);
    expect(userCreated.birthDate).to.be.deep.eq(USER_INPUT.birthDate);
    expect(passwordCompare).to.be.deep.eq(true);
    await dataSource.query(`DELETE FROM "user" WHERE id = ${userCreated.id}`);
  });
});
