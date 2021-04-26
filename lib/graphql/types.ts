import { object, string, Struct } from "superstruct";
import { Field, Resolver } from "type-graphql";

export type User = {
  id: string;
  name: string;
};
export type GraphqlContext = {
  user?: User;
};

export const authTokenPayload = object({
  userId: string(),
  userName: string(),
});

export type AuthTokenPayload = typeof authTokenPayload.TYPE;
