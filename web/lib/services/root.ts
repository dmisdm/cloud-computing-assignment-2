// IoC Root
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { SubscriptionService } from "./SubscriptionsService";
import { UserService } from "./UserService";
const region = "ap-southeast-2";
const db = new DynamoDB({ region });
const s3 = new S3({ region });
const artistImagesBucketName = "cloud-computing-assignment-2-artist-images";
export const userService = new UserService(db);
export const subscriptionService = new SubscriptionService(
  db,
  s3,
  artistImagesBucketName
);
