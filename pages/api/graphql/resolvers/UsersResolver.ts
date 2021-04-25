import { Resolver, Query } from "type-graphql";

@Resolver()
export class UsersResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }
}
