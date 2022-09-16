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
  const urlDB = "http://localhost:4000/graphql";
  const USER_INPUT = {
    name: "Samuel Satana",
    email: "SamuelTeste1@gmail.com",
    birthDate: "21/02/2002",
    password: "1234qwer",
  };

  it("should return createUser", async () => {
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
          email: "SamuelTeste1@gmail.com",
          name: "Samuel Satana",
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
    await dataSource.query('TRUNCATE TABLE "user"');
  });

  it("should return invalid password format", async () => {
    const inputTestPassword = {
      name: "Samuel Satana",
      email: "SamuelTeste@gmail.com",
      birthDate: "21/02/2002",
      password: "123",
    };

    const response = await axios.post(urlDB, {
      variables: {
        data: inputTestPassword,
      },
      query: mutation,
    });

    const expectedResponse = {
      message:
        "A senha deve possuir ao menos 6 caracteres, com 1 letra e 1 numero",
      code: 400,
    };
    expect(response.data.errors[0].message).to.be.deep.equal(
      expectedResponse.message
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.deep.equal(
      expectedResponse.code
    );
  });

  it("should return email already exist", async () => {
    await axios.post(urlDB, {
      variables: {
        data: USER_INPUT,
      },
      query: mutation,
    });
    const response = await axios.post(urlDB, {
      variables: {
        data: USER_INPUT,
      },
      query: mutation,
    });

    const expectedResponse = {
      message: "Este email já esta cadastrado",
      code: 409,
    };
    expect(response.data.errors[0].message).to.be.deep.equal(
      expectedResponse.message
    );
    expect(response.data.errors[0].extensions.exception.code).to.be.deep.equal(
      expectedResponse.code
    );
    await dataSource.query('TRUNCATE TABLE "user"');
  });
});
