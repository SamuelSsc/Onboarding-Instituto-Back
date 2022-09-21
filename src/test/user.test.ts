import axios from "axios";
import { User } from "../entity/User";
import { dataSource } from "../data-source";
import * as bcrypt from "bcrypt";
import { expect } from "chai";
import * as jwt from "jsonwebtoken";

afterEach(async function () {
  await dataSource.query('TRUNCATE TABLE "user"');
});

describe("Query User", () => {
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
  const token = jwt.sign({ userId: 1 }, process.env.TOKEN_KEY);
  let input = {
    id: 1,
  };
  async function CreateUser() {
    const defaultUser = {
      name: "Samuel Santana",
      email: "Samuelssc5874@gmail.com",
      birthDate: "21/2002",
      password: "1234qwer",
    };

    const ROUNDS = 10;
    const passwordHashed = await bcrypt.hash(defaultUser.password, ROUNDS);
    const user = new User();
    user.name = defaultUser.name;
    user.email = defaultUser.email;
    user.birthDate = defaultUser.birthDate;
    user.password = passwordHashed;
    await dataSource.save(user);
  }

  it("should return user", async () => {
    await CreateUser();
    const userDB = await dataSource.findOneBy(User, {
      email: "Samuelssc5874@gmail.com",
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
    expect(response.status).to.equal(200);
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it("should return user not found", async () => {
    await CreateUser();
    input.id = Math.floor(Math.random() * 65536);
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
    expect(response.data.errors[0].extensions.exception.code).to.be.deep.eq(
      expectedResponse.code
    );
    expect(response.data.errors[0].message).to.be.deep.eq(
      expectedResponse.message
    );
  });

  it("should return invalid or not found token", async () => {
    await CreateUser();
    const userDB = await dataSource.findOneBy(User, {
      email: "Samuelssc5874@gmail.com",
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
});
