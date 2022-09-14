import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export function createConnection() {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    url: process.env.DB_URL,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });

  return AppDataSource;
}
