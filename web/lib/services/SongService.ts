import { DynamoDB, ScanInput } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { Music } from "lib/types";
import { dynamoDbItemToObject } from "./utils";

const TableName = "music";

export class SongService {
  constructor(private db: DynamoDB, s3: S3, bucketName: string) {}
  async search(params: {
    filters: { key: string; value: string }[];
  }): Promise<Music.SongItem[]> {
    return (
      (
        await this.db.scan({
          TableName,
          ScanFilter: params.filters.reduce(
            (acc, next) => ({
              ...acc,
              [next.key]: {
                AttributeValueList: [
                  {
                    S: next.value,
                  },
                ],
                ComparisonOperator: "EQ",
              },
            }),
            {} as ScanInput["ScanFilter"]
          ),
        })
      ).Items?.map(dynamoDbItemToObject).map(Music.SongItem.create) || []
    );
  }
}
