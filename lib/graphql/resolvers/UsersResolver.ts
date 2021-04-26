import { Resolver, Query, Authorized } from "type-graphql";

@Resolver()
export class UsersResolver {
  @Authorized()
  @Query(() => String)
  hello() {
    return "hi!";
  }
}
