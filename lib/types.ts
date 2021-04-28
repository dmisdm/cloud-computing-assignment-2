import { parseISO, fromUnixTime } from "date-fns";
import {
  coerce,
  create,
  date,
  Infer,
  number,
  object,
  string,
  Struct,
  type,
  union,
  unknown,
} from "superstruct";
export const APIError = object({
  errorMessage: string(),
  errorName: string(),
  detail: unknown(),
});
export const createApiError = (error: typeof APIError.TYPE) =>
  APIError.create(error);

export const createStruct = <Type, Schema>(
  struct: Struct<Type, Schema>,
  data: Infer<typeof struct>
) => create(data, struct);

const expDate = coerce(date(), union([string(), number()]), (value) =>
  typeof value === "string" ? parseISO(value) : fromUnixTime(value)
);
export namespace Login {
  export const LoginRequest = object({
    id: string(),
    password: string(),
  });

  export const LoginSuccess = object({
    id: string(),
    name: string(),
    expiry: expDate,
  });
}

export type User = {
  id: string;
  name: string;
};
export type GraphqlContext = {
  user?: User;
};

export const authTokenPayload = type({
  userId: string(),
  userName: string(),
  exp: expDate,
});

export type AuthTokenPayload = typeof authTokenPayload.TYPE;
