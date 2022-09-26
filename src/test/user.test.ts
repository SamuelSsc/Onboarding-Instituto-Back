import axios from "axios";
import { User } from "../entity/User";
import { ClearDb, dataSource } from "../data-source";
import { expect } from "chai";
import * as jwt from "jsonwebtoken";
import { CreateUser, defaultUser } from "../utils/create-user";

describe("Query User", () => {
  afterEach(async function () {
    await ClearDb();
  });

  beforeEach(async function () {
    await CreateUser({});
  });

  const urlDB = "http://localhost:4000//graphql";
  const query = `
        query user($data:UserInfo!){
        user(data: $data){
            id
            name
            email
            birthDate
        }
        }
      `;

  let input = {
    id: 1,
  };

  it("should return user", async () => {
    const userDB = await dataSource.findOneBy(User, {
      email: defaultUser.email,
    });
    input.id = userDB.id;
    const token = jwt.sign({ userId: input.id }, process.env.TOKEN_KEY);

    const response = await axios.post(
      urlDB,
      {
        variables: {
          data: input,
        },
        query: query,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const expectedResponse = {
      data: {
        user: {
          id: userDB.id,
          name: userDB.name,
          email: userDB.email,
          birthDate: userDB.birthDate,
        },
      },
    };
    expect(response.status).to.eq(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it("should return user not found", async () => {
    input.id = 0;
    const userDB = await dataSource.findOneBy(User, {
      email: defaultUser.email,
    });
    const token = jwt.sign({ userId: userDB.id }, process.env.TOKEN_KEY);

    const response = await axios.post(
      urlDB,
      {
        variables: {
          data: input,
        },
        query: query,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const expectedResponse = {
      message: "Usuario não encontrado verifique o id",
      code: 404,
    };
    expect(response.data.errors[0].extensions.exception.code).to.eq(
      expectedResponse.code
    );
    expect(response.data.errors[0].message).to.eq(expectedResponse.message);
  });

  it("should return invalid or not found token - Token Invalid", async () => {
    const userDB = await dataSource.findOneBy(User, {
      email: defaultUser.email,
    });
    input.id = userDB.id;

    const response = await axios.post(
      urlDB,
      {
        variables: {
          data: input,
        },
        query: query,
      },
      {
        headers: {
          Authorization: "TokenInvalid",
        },
      }
    );

    const expectedResponse = {
      message:
        "Token invalido ou não encontrado, você não possui permissão para ver as informações do usuario.",
      code: 401,
    };
    expect(response.data.errors[0].extensions.exception.code).to.be.deep.eq(
      expectedResponse.code
    );
    expect(response.data.errors[0].message).to.be.deep.eq(
      expectedResponse.message
    );
  });

  it("should return invalid or not found token - dont send token", async () => {
    const userDB = await dataSource.findOneBy(User, {
      email: defaultUser.email,
    });
    input.id = userDB.id;

    const response = await axios.post(urlDB, {
      variables: {
        data: input,
      },
      query: query,
    });

    const expectedResponse = {
      message:
        "Token invalido ou não encontrado, você não possui permissão para ver as informações do usuario.",
      code: 401,
    };
    expect(response.data.errors[0].extensions.exception.code).to.be.deep.eq(
      expectedResponse.code
    );
    expect(response.data.errors[0].message).to.be.deep.eq(
      expectedResponse.message
    );
  });
});
