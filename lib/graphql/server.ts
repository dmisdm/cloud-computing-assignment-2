import "reflect-metadata";
import { ApolloServer, Request } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/UsersResolver";
import { authChecker } from "./authChecker";
import { GraphqlContext } from "./types";
import { authCookieKey, verifyAndDecodeToken } from "./auth";
import { NextApiRequest } from "next";
import { InvalidAuthToken } from "../api/errors";
import { AuthenticationResolver } from "./resolvers/AuthenticationResolver";

export const makeApolloServer = async () =>
  new ApolloServer({
    schema: await buildSchema({
      resolvers: [UsersResolver, AuthenticationResolver],
      validate: true,
      authChecker,
    }),
    context: ({ req }: { req: NextApiRequest }): GraphqlContext => {
      try {
        const cookieValue = req.cookies[authCookieKey];
        if (!cookieValue) {
          return {};
        }
        const decodedUser = verifyAndDecodeToken(req.cookies[authCookieKey]);
        return {
          user: {
            id: decodedUser.userId,
            name: decodedUser.userName,
          },
        };
      } catch (e) {
        throw new InvalidAuthToken(
          e instanceof Error ? e.message : "Unkown reason"
        );
      }
    },
  });
