import axios from "axios";
import { User } from "../entity/User";
import { dataSource } from "../data-source";
import * as bcrypt from "bcrypt";
import { expect } from "chai";

afterEach(async function () {
  await dataSource.query('TRUNCATE TABLE "user"');
});

describe("Mutation Login", () => {
  const mutation = `mutation login($data:LoginInput!){
  login(data:$data){
	user{
        id
        name
        email
        birthDate
    }
    token
  }
}`;

  let input = {
    email: "Samuelssc5874@gmail.com",
    password: "1234qwer",
    rememberMe: true,
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

  const urlDB = "http://localhost:4000/graphql";

  it("should return login", async () => {
    await CreateUser();
    const userDB = await dataSource.findOneBy(User, {
      email: input.email,
    });
    const response = await axios.post(urlDB, {
      variables: {
        data: input,
      },
      query: mutation,
    });

    const expectedResponse = {
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      birthDate: userDB.birthDate,
    };
    expect(response.status).to.be.deep.eq(200);
    expect(response.data.data.login.user).to.be.deep.eq(expectedResponse);
  });

  it("should return invalid credentials", async () => {
    input.password = "SenhaErrada";

    const response = await axios.post(urlDB, {
      variables: {
        data: input,
      },
      query: mutation,
    });

    const expectedResponse = {
      message: "Credenciais invalidas, por favor verifique email e senha.",
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
