import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { createStruct, Music, Subscriptions } from "lib/types";
import { SongService } from "./SongService";
import { UserService } from "./UserService";
import { dynamoDbItemToObject, structToDynamoDbItem } from "./utils";

const TableName = "user_subscriptions";

const getKey = (params: { email: string; songId: string }) =>
  `${params.email}---${params.songId}`;
export class SubscriptionService {
  constructor(
    private db: DynamoDB,
    private songService: SongService,
    private userService: UserService
  ) {}
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
    const subscriptionsBySongId = items.reduce(
      (acc, next) => ({
        ...acc,
        [next.songId]: next,
      }),
      {} as Record<string, Subscriptions.SubscriptionItem>
    );
    return (await this.songService.getSongs(items.map((item) => item.songId)))
      .map((song) => ({
        email,
        song,
        subscribedAt: subscriptionsBySongId[song.id].subscribedAt,
      }))
      .sort((a, z) => a.subscribedAt.valueOf() - z.subscribedAt.valueOf());
  }

  async subscribeUserToSong(params: {
    email: string;
    songId: string;
  }): Promise<Subscriptions.Subscription | "UserNotFound" | "SongNotFound"> {
    const emailSongId = getKey(params);
    const existing = await this.db.getItem({
      TableName,
      Key: {
        emailSongId: {
          S: emailSongId,
        },
      },
    });

    const song = await this.songService.getSong(params.songId);
    if (!song) {
      return "SongNotFound";
    }

    if (!existing.Item) {
      const user = await this.userService.getUser(params.email);
      if (!user) {
        return "UserNotFound";
      }
      const now = new Date();
      await this.db.putItem({
        TableName,
        Item: structToDynamoDbItem(
          createStruct(Subscriptions.SubscriptionItem, {
            ...params,
            emailSongId: emailSongId,
            subscribedAt: now,
          })
        ),
      });
      return {
        email: params.email,
        song,
        subscribedAt: now,
      };
    } else {
      return Subscriptions.Subscription.create(
        dynamoDbItemToObject(existing.Item)
      );
    }
  }

  async unsubscribeUserFromSong(params: { songId: string; email: string }) {
    await this.db.deleteItem({
      TableName,
      Key: {
        emailSongId: { S: getKey(params) },
      },
    });
  }
}
