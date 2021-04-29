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
  user_name: lowercasedString,
  password: string(),
});

export class UserService {
  constructor(private db: DynamoDB) {}

  async validateCredentials(params: { email: string; password: string }) {
    const { Item } = await this.db.getItem({
      TableName,
      Key: { email: { S: params.email } },
    });

    if (!Item) {
      return false;
    }
    const user = User.create(dynamoDbItemToObject(Item));

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
    const { Items } = await this.db.scan({
      TableName,
      ScanFilter: {
        email: {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            {
              S: params.email,
            },
          ],
        },
        user_name: {
          ComparisonOperator: "EQ",
          AttributeValueList: [
            {
              S: params.name,
            },
          ],
        },
      },
    });
    if (Items?.length) {
      const first = User.create(dynamoDbItemToObject(Items[0]));
      if (first.email === params.email) {
        return "EmailExists";
      } else {
        return "UsernameExists";
      }
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