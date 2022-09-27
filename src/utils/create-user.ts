import { dataSource } from "../data-source";
import { User } from "../entity";
import * as bcrypt from "bcrypt";

interface CreateUserProps {
  name?: string;
  email?: string;
  birthDate?: string;
  password?: string;
}

export const defaultUser = {
  name: "Samuel Santana",
  email: "Samuelssc5874@gmail.com",
  birthDate: "21/2002",
  password: "1234qwer",
};

export async function CreateUser(props: CreateUserProps) {
  const ROUNDS = 10;
  const passwordHashed = await bcrypt.hash(
    props.password ?? defaultUser.password,
    ROUNDS
  );
  const user = new User();
  user.name = props.name ?? defaultUser.name;
  user.email = props.email ?? defaultUser.email;
  user.birthDate = props.birthDate ?? defaultUser.birthDate;
  user.password = passwordHashed;
  await dataSource.save(user);
}
