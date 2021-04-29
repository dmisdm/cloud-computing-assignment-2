import { authTokenPayload, AuthTokenPayload } from "./types";
import { sign, verify } from "jsonwebtoken";
import { add } from "date-fns";
const secret = "veryverysupersecret";
export const authCookieKey = "user_token";
export const encodePayload = (payload: Omit<AuthTokenPayload, "exp">) => {
  const expiresInHours = 1;
  const exp = add(new Date(), { hours: expiresInHours });
  return {
    token: sign({ ...payload, exp: exp.valueOf() / 1000 }, secret),
    exp,
  };
};

export const verifyAndDecodeToken = (token: string) =>
  authTokenPayload.create(verify(token, secret));
