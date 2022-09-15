import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entity/User";

const isTest = process.env.TEST;
dotenv.config(isTest && { path: __dirname + "/../test.env" });

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

export async function createConnection() {
  await AppDataSource.initialize();
}

export const dataSource = AppDataSource.manager;
