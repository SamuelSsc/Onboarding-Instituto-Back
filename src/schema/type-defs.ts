import { gql } from "apollo-server";

export const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type User {
    id: Int
    name: String!
    email: String!
    birthDate: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    createUser(data: UserInput!): User
  }
`;
