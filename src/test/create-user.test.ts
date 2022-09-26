import axios from "axios";
import { expect } from "chai";
import { dataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { CreateUser } from "../utils/create-user";

describe("Mutation createUser", () => {
  afterEach(async function () {
    await dataSource.query('TRUNCATE TABLE "user"');
  });

  beforeEach(async function () {
    input = {
      name: "Samuel Satana",
      email: "SamuelTeste1@gmail.com",
      birthDate: "21/02/2002",
      password: "1234qwer",
    };
  });

  const mutation = `mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
          id
          email
          name
          birthDate
        }
      }
      `;
  let input: {
    name: string;
    email: string;
    birthDate: string;
    password: string;
  };
  const urlDB = "http://localhost:4000/graphql";

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
          email: input.email,
          name: input.name,
          birthDate: input.birthDate,
        },
      },
    };
    expect(response.status).to.eq(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(userDb.name).to.eq(expectedResponse.data.createUser.name);
    expect(userDb.email).to.eq(expectedResponse.data.createUser.email);
    expect(userDb.birthDate).to.eq(expectedResponse.data.createUser.birthDate);
    expect(passwordCompare).to.eq(true);
  });

  it("should return email already exist", async () => {
    await CreateUser(input);

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
    expect(response.data.errors[0].message).to.eq(expectedResponse.message);
    expect(response.data.errors[0].extensions.exception.code).to.eq(
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
    expect(response.data.errors[0].message).to.eq(expectedResponse.message);
    expect(response.data.errors[0].extensions.exception.code).to.eq(
      expectedResponse.code
    );
  });
});
