// IoC Root
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { SongService } from "./SongService";
import { SubscriptionService } from "./SubscriptionsService";
import { UserService } from "./UserService";
const region = "ap-southeast-2";

const db = new DynamoDB({ region });
const s3 = new S3({ region });
const artistImagesBucketName = "cloud-computing-assignment-2-artist-images";
const artistImagesBucketUrl = `https://${artistImagesBucketName}.s3-${region}.amazonaws.com`;
export const userService = new UserService(db);
export const songService = new SongService(db, { artistImagesBucketUrl });
export const subscriptionService = new SubscriptionService(
  db,
  songService,
  userService
);
