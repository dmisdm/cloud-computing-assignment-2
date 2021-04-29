import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { Music, Subscriptions } from "lib/types";
import { dynamoDbItemToObject } from "./utils";

const TableName = "user_subscriptions";

export class SubscriptionService {
  constructor(private db: DynamoDB, s3: S3, bucketName: string) {}
  async subscriptionsForUser(
    email: string
  ): Promise<Subscriptions.SubscriptionsPageResponse> {
    const scanRequest = await this.db.scan({
      TableName,
      ScanFilter: {
        email: {
          AttributeValueList: [{ S: email }],
          ComparisonOperator: "EQ",
        },
      },
    });
    const items =
      scanRequest.Items?.map((item) =>
        Subscriptions.SubscriptionItem.create(dynamoDbItemToObject(item))
      ) || [];
    if (!items.length) return [];
    return (
      (
        await this.db.batchGetItem({
          RequestItems: {
            [TableName]: {
              Keys: items.map((item) => ({ id: { S: item.songId } })),
            },
          },
        })
      ).Responses?.[TableName]?.map((item) => ({
        email,
        song: Music.SongItem.create(dynamoDbItemToObject(item)),
      })) || []
    );
  }
}
