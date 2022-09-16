import { dataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { CustomError } from "../errors";

export const resolvers = {
  Query: {
    hello: () => "Hello Word!",
  },
  Mutation: {
    createUser: async (parent, args) => {
      const regex = /^((?=\S*?[a-z,A-Z])(?=\S*?[0-9]).{6,})\S/;
      if (!regex.test(args.data.password))
        throw new CustomError(
          "A senha deve possuir ao menos 6 caracteres, com 1 letra e 1 numero",
          400
        );

      const isEmailAlreadyExist = await dataSource.findBy(User, {
        email: args.data.email,
      });
      if (!!isEmailAlreadyExist.length)
        throw new CustomError("Este email já esta cadastrado", 409);

      const ROUNDS = 10;
      const passwordHashed = await bcrypt.hash(args.data.password, ROUNDS);

      const user = new User();
      user.name = args.data.name;
      user.email = args.data.email;
      user.birthDate = args.data.birthDate;
      user.password = passwordHashed;
      await dataSource.save(user);

      return user;
    },
  },
};
