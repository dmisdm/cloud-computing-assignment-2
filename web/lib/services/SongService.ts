import {
  ComparisonOperator,
  DynamoDB,
  ScanInput,
} from "@aws-sdk/client-dynamodb";
import { Music } from "lib/types";
import { dynamoDbItemToObject } from "./utils";

const TableName = "music";

export class SongService {
  constructor(
    private db: DynamoDB,
    private opts: { artistImagesBucketUrl: string }
  ) {}
  async getSongs(ids: string[]): Promise<Music.SongItem[]> {
    return (
      (
        await this.db.batchGetItem({
          RequestItems: {
            [TableName]: {
              Keys: ids.map((id) => ({ id: { S: id } })),
            },
          },
        })
      ).Responses?.[TableName]?.map((item) =>
        Music.SongItem.create(dynamoDbItemToObject(item))
      ) || []
    );
  }
  async getSong(id: string): Promise<Music.SongItem | undefined> {
    const result = await this.db.getItem({
      TableName,
      Key: {
        id: { S: id },
      },
    });

    if (!result.Item) {
      return undefined;
    } else {
      return Music.SongItem.create(dynamoDbItemToObject(result.Item));
    }
  }
  async search(params: {
    limit: number;
    filters: { key: string; value: string; operator: ComparisonOperator }[];
  }): Promise<Music.SongItem[]> {
    const ScanFilter = params.filters.reduce(
      (acc, next) => ({
        ...acc,
        [next.key]: {
          AttributeValueList: [
            {
              S: next.value,
            },
          ],
          ComparisonOperator: next.operator,
        },
      }),
      {} as ScanInput["ScanFilter"]
    );
    const searchResponse = await this.db.scan({
      TableName,
      Limit: params.limit,
      ScanFilter,
    });

    return (
      searchResponse.Items?.map((item) => dynamoDbItemToObject(item))
        .map((item) => Music.SongItem.create(item))
        .map((song) => ({
          ...song,
          img_url: `${this.opts.artistImagesBucketUrl}/${encodeURIComponent(
            song.artist
          )}`,
        })) || []
    );
  }
}
