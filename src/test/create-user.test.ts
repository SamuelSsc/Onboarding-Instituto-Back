import axios from "axios";
import { expect } from "chai";
import { dataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

afterEach(async function () {
  await dataSource.query('TRUNCATE TABLE "user"');
});

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
  let input = {
    name: "Samuel Satana",
    email: "SamuelTeste1@gmail.com",
    birthDate: "21/02/2002",
    password: "1234qwer",
  };

  it("should return createUser", async () => {
    const response = await axios.post(urlDB, {
      variables: {
        data: input,
      },
      query: mutation,
    });
    const userDb = await dataSource.findOneBy(User, {
      email: input.email,
    });
    const passwordCompare = await bcrypt.compare(
      input.password,
      userDb.password
    );

    const expectedResponse = {
      data: {
        createUser: {
          id: userDb.id,
          email: "SamuelTeste1@gmail.com",
          name: "Samuel Satana",
          birthDate: "21/02/2002",
        },
      },
    };
    expect(response.status).to.equal(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(userDb.name).to.be.deep.eq(input.name);
    expect(userDb.email).to.be.deep.eq(input.email);
    expect(userDb.birthDate).to.be.deep.eq(input.birthDate);
    expect(passwordCompare).to.be.deep.eq(true);
  });

  it("should return email already exist", async () => {
    await axios.post(urlDB, {
      variables: {
        data: input,
      },
      query: mutation,
    });
    const response = await axios.post(urlDB, {
      variables: {
        data: input,
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
  });

  it("should return invalid password format", async () => {
    input.password = "123";

    const response = await axios.post(urlDB, {
      variables: {
        data: input,
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
});
