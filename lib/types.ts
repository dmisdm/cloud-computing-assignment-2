import {
  coerce,
  create,
  date,
  Infer,
  object,
  string,
  Struct,
  unknown,
} from "superstruct";
import { parseISO } from "date-fns";
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

const coercedDate = coerce(date(), string(), (value) => parseISO(value));
export namespace Login {
  export const LoginRequest = object({
    id: string(),
    password: string(),
  });

  export const LoginSuccess = object({
    id: string(),
    name: string(),
    expiry: coercedDate,
  });
}
