import "reflect-metadata";
import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/UsersResolver";

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UsersResolver],
    validate: true,
  }),
});
export const config = {
  api: {
    bodyParser: false,
  },
};
export default apolloServer.createHandler({ path: "/api/graphql" });
