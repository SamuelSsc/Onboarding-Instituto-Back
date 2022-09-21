import { CreateUser } from "../utils/create-user";
import { faker } from "@faker-js/faker";

export async function usersSeed() {
  for (let i = 0; i < 50; i++) {
    const user = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: `${faker.internet.email()}`,
      birthDate: `${faker.date.birthdate()}`,
      password: "1234qwer",
    };
    CreateUser(user);
  }
  console.info("Users Created!");
}
