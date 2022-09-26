import { ClearDb, dataSource } from "../data-source";
import { expect } from "chai";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { usersSeed } from "../seed/users.seed";
import { User } from "../entity/User";

describe("Query Users", () => {
  let users: User[];
  beforeEach(async () => {
    await usersSeed();
    users = await dataSource.find(User);
  });

  afterEach(async function () {
    await ClearDb();
  });

  const urlDB = "http://localhost:4000//graphql";
  const query = `
    query users($data:UsersPagination){
        users(data: $data){
            users{
            id
            name
            }
            hasNextPage
            hasPreviousPage
            totalUsers
        }
    }
  `;
  let input: { limit: number; offset: number };

  it("should return users", async () => {
    const token = jwt.sign({ userId: users[0].id }, process.env.TOKEN_KEY);
    input = {
      limit: 10,
      offset: 0,
    };
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

    expect(response.status).to.be.deep.eq(200);
    expect(response.data.data.users.totalUsers).to.be.deep.eq(25);
  });

  it("should return invalid or not found token, tokenInvalid", async () => {
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
        "Token invalido ou não encontrado, você não possui permissão para ver a lista de usuários.",
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
