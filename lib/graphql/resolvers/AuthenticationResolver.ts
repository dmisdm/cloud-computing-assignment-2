import {
  Arg,
  Args,
  InterfaceType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { BaseApiError } from "../../api/errors";
import { AuthTokenPayload, authTokenPayload } from "../types";

@ObjectType()
export class AuthTokenPayloadObject implements AuthTokenPayload {
  readonly userId: string;
  readonly userName: string;
  constructor(data: AuthTokenPayload) {
    this.userId = data.userId;
    this.userName = data.userName;
  }
}

@Resolver()
export class AuthenticationResolver {
  @Mutation(() => AuthTokenPayloadObject)
  login() {
    return new AuthTokenPayloadObject({
      userId: "test",
      userName: "Test User",
    });
  }
}
