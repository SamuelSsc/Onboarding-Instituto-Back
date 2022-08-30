const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello Word!",
  },
};

const port = 4000;
const app = new ApolloServer({ typeDefs, resolvers });
app
  .listen(port)
  .then(() => console.info(`Server executing on port ${port}`))
  .catch((error) => console.error(error));
