import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { encodePayload } from "lib/auth";
import { createStruct, email } from "lib/types";
import { coerce, object, string, intersection, refine } from "superstruct";
import { dynamoDbItemToObject, structToDynamoDbItem } from "./utils";

const TableName = "login";

const lowercasedString = coerce(string(), string(), (value) =>
  value.toLowerCase()
);
const User = object({
  email: intersection([lowercasedString, email]),
  user_name: string(),
  password: string(),
});
export type User = typeof User.TYPE;

export class UserService {
  constructor(private db: DynamoDB) {}
  async getUser(email: string): Promise<User | undefined> {
    const { Item } = await this.db.getItem({
      TableName,
      Key: { email: { S: email } },
    });

    if (!Item) {
      return undefined;
    }
    return User.create(dynamoDbItemToObject(Item));
  }
  async validateCredentials(params: { email: string; password: string }) {
    const user = await this.getUser(params.email);
    if (!user) {
      return false;
    }
    if (user.password !== params.password) {
      return false;
    }

    return encodePayload({
      email: user.email,
      name: user.user_name,
    });
  }

  async registerUser(params: {
    email: string;
    name: string;
    password: string;
  }) {
    const existing = await this.getUser(params.email);
    if (existing) {
      return "EmailExists";
    }

    await this.db.putItem({
      TableName,
      Item: structToDynamoDbItem(
        createStruct(User, {
          email: params.email,
          user_name: params.name,
          password: params.password,
        })
      ),
    });

    return {
      email: params.email,
      name: params.name,
    };
  }
}
