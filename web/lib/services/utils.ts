import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const dynamoDbItemToObject = (item: {
  [k: string]: AttributeValue;
}): Record<string, unknown> =>
  Object.entries(item).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Object.values(value)[0],
    }),
    {}
  );

export const structToDynamoDbItem = <T extends object>(
  data: T
): Record<string, AttributeValue> =>
  Object.entries(data).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]:
        typeof value === "number" || typeof value === "bigint"
          ? {
              N: value,
            }
          : typeof value === "boolean"
          ? {
              B: value,
            }
          : {
              S: value,
            },
    }),
    {}
  );
