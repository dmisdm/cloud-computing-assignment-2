import { authTokenPayload, AuthTokenPayload } from "./types";
import { sign, verify } from "jsonwebtoken";

const secret = "veryverysupersecret";
const expiresIn = "1 hour";
export const authCookieKey = "user_token";
export const encodePayload = (payload: AuthTokenPayload): string => {
  return sign(payload, secret, { expiresIn });
};

export const verifyAndDecodeToken = (token: string) =>
  authTokenPayload.create(verify(token, secret));
