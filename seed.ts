#!/usr/bin/env yarn ts-node --project ./seed.tsconfig.json
import { object, string } from "superstruct";
import fetch from "cross-fetch";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import a2 from "./a2.json";
import { v4 } from "uuid";
const region = "ap-southeast-2";
const db = new DynamoDB({ region });
const s3 = new S3({ region });
const artistImagesBucket = "cloud-computing-assignment-2-artist-images";

const userId = "s3429288";
const passwordTemplate = "012345678901234567890";

const log = console.log;

const seedMusicTable = async () => {
  const songPutRequests = a2.songs.map((song) => ({
    PutRequest: {
      Item: {
        id: {
          S: v4(),
        },
        title: {
          S: song.title,
        },
        artist: {
          S: song.artist,
        },
        img_url: {
          S: song.img_url,
        },
        web_url: {
          S: song.web_url,
        },
        year: {
          S: song.year,
        },
      },
    },
  }));
  let cache: typeof songPutRequests[0][] = [];
  for (const song of songPutRequests) {
    if (cache.length >= 2) {
      log("Writing batch");
      await db.batchWriteItem({
        RequestItems: {
          music: cache,
        },
      });
      await new Promise((res) => setTimeout(res, 500));
      cache = [];
    }
    cache.push(song);
  }
  if (cache.length > 0) {
    await db.batchWriteItem({
      RequestItems: {
        music: cache,
      },
    });
    cache = [];
  }
};

const Song = object({
  id: string(),
  img_url: string(),
  artist: string(),
});
const syncS3ArtistImages = async () => {
  const buckets = await s3.listBuckets({});
  if (!buckets.Buckets?.find((bucket) => bucket.Name === artistImagesBucket))
    await s3.createBucket({ Bucket: artistImagesBucket });

  await s3.putBucketPolicy({
    Bucket: artistImagesBucket,
    Policy: JSON.stringify({
      Statement: {
        Sid: "AllowPublicRead",
        Effect: "Allow",
        Principal: {
          AWS: "*",
        },
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${artistImagesBucket}/*`,
      },
    }),
  });

  const songs = await db.scan({
    TableName: "music",
    AttributesToGet: ["img_url", "id", "artist"],
  });
  if (!songs.Items) {
    throw Error(
      "No songs found in table so unable to upload any artist images"
    );
  }
  const uploadedArtistImages = new Set<string>();
  const existingImageKeys = new Set(
    (await s3.listObjects({ Bucket: artistImagesBucket }))?.Contents?.map(
      (obj) => obj.Key
    ) || ([] as string[])
  );
  for (const item of songs.Items) {
    const { img_url: url, id, artist } = Song.create({
      img_url: item.img_url.S,
      id: item.id.S,
      artist: item.artist.S,
    });
    const key = artist;
    if (existingImageKeys.has(key)) {
      log(`Skipping uploading ${key} as it already exists`);
      continue;
    }
    const imgUrlRequest = await fetch(url);
    if (!imgUrlRequest.ok || !imgUrlRequest.body) {
      console.error(await imgUrlRequest.text());
      throw Error("Bad request for image: " + url);
    }

    const buffer = new Uint8Array(await imgUrlRequest.arrayBuffer());
    if (!uploadedArtistImages.has(key)) {
      console.log("Uploading " + key);
      await s3.putObject({
        Bucket: artistImagesBucket,
        Key: key,
        Body: buffer,
      });
      uploadedArtistImages.add(key);
    }
  }
};

const seedLoginTable = async () => {
  await db.batchWriteItem({
    RequestItems: {
      login: initialUsers.map((user) => ({ PutRequest: { Item: user } })),
    },
  });
};

const initialUsers = Array.from(new Array(10), (_, i) => ({
  email: { S: `${userId}${i}@student.rmit.edu.au` },
  user_name: { S: `Firstname Lastname${i}` },
  password: { S: passwordTemplate.slice(i, i + 6) },
}));

const waitForTableCreation = (tableName: string) =>
  new Promise((res, rej) => {
    let resolved = false;
    log(`Waiting for table "${tableName}" to be created`);
    log("Will timeout after 10 seconds");
    const interval = setInterval(async () => {
      const tableDescription = await db.describeTable({ TableName: tableName });
      if (resolved) {
        return;
      }
      if (tableDescription.Table?.TableStatus?.toLowerCase() === "active") {
        resolved = true;
        clearInterval(interval);
        clearTimeout(timeout);
        log(`"${tableName}" table created!`);
        res(true);
      }
    }, 1000);
    const timeout = setTimeout(() => {
      if (resolved) return;
      clearInterval(interval);
      clearTimeout(timeout);
      rej("Timed out");
    }, 10000);
  });

const run = async () => {
  const tables = await db.listTables({});

  if (tables.TableNames?.indexOf("login") === -1) {
    log("Creating login table");
    await db.createTable({
      TableName: "login",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "email", AttributeType: "S" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });
    await waitForTableCreation("login");
    log("Seeding login table");
    await seedLoginTable();
  } else {
    log("Login table exists. Skipping seeding");
  }

  if (tables.TableNames?.indexOf("music") === -1) {
    log("Creating music table");
    await db.createTable({
      TableName: "music",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    });
    await waitForTableCreation("music");
    log("Seeding music table");
    await seedMusicTable();
    log("Syncing/uploading artist images to S3");
    await syncS3ArtistImages();
  } else {
    log("Music table exists. Skipping seeding.");
  }

  if (tables.TableNames?.indexOf("user_subscriptions") === -1) {
    log("Creating user_subscriptions table");
    await db.createTable({
      TableName: "user_subscriptions",
      KeySchema: [{ AttributeName: "emailSongId", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      AttributeDefinitions: [
        { AttributeName: "emailSongId", AttributeType: "S" },
      ],
    });
    await waitForTableCreation("user_subscriptions");
  } else {
    log("Subscriptions exists. Skipping seeding.");
  }
};

run();
