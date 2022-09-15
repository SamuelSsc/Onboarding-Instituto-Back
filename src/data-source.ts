import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export let AppDataSource: DataSource;

export function createConnection() {
  AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    url: process.env.DB_URL,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
}
