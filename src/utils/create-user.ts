import { dataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

interface CreateUserProps {
  name: string;
  email: string;
  birthDate: string;
  password: string;
}

export async function CreateUser(props: CreateUserProps) {
  const ROUNDS = 10;
  const passwordHashed = await bcrypt.hash(props.password, ROUNDS);
  const user = new User();
  user.name = props.name;
  user.email = props.email;
  user.birthDate = props.birthDate;
  user.password = passwordHashed;
  await dataSource.save(user);
}
