import { parseISO, fromUnixTime } from "date-fns";
import IsEmail from "isemail";
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
  partial,
  refine,
  optional,
  array,
} from "superstruct";
export const APIError = coerce(
  object({
    errorMessage: string(),
    errorName: string(),
    detail: optional(unknown()),
  }),
  string(),
  (value) => ({
    errorMessage: value,
    errorName: "Unknown",
  })
);

export type APIError = typeof APIError.TYPE;
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
    email: string(),
    password: string(),
  });

  export const LoginSuccess = object({
    email: string(),
    username: string(),
    exp: expDate,
  });
}

export const email = refine(string(), "Email", (value) =>
  IsEmail.validate(value)
);
export namespace RegisterPage {
  export const RegistrationRequest = object({
    email: email,
    name: string(),
    password: string(),
  });

  export const RegistrationSucessResponse = object({
    email: string(),
    name: string(),
  });
}

export type User = {
  email: string;
  name: string;
};
export type GraphqlContext = {
  user?: User;
};

export const authTokenPayload = type({
  email: string(),
  name: string(),
  exp: expDate,
});

export type AuthTokenPayload = typeof authTokenPayload.TYPE;

export namespace Music {
  export const SongItem = object({
    id: string(),
    title: string(),
    artist: string(),
    year: number(),
    img_url: string(),
    web_url: string(),
  });
  export type SongItem = typeof SongItem.TYPE;
}
export namespace Subscriptions {
  export const SubscriptionItem = object({
    email: string(),
    songId: string(),
  });
  export const SubscriptionsPageResponse = array(
    object({
      email: string(),
      song: Music.SongItem,
    })
  );
  export type SubscriptionsPageResponse = typeof SubscriptionsPageResponse.TYPE;
  export type SubscriptionItem = typeof SubscriptionItem.TYPE;
}
