import { gql } from "apollo-server";

export const typeDefs = gql`
  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean!
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

  type Login {
    user: User!
    token: String!
  }

  type Mutation {
    createUser(data: UserInput!): User
    login(data: LoginInput!): Login
  }
`;
