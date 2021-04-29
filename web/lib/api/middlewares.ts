import { authCookieKey, verifyAndDecodeToken } from "lib/auth";
import { AuthTokenPayload } from "lib/types";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { StructError } from "superstruct";
import { BaseApiError, InvalidAuthToken, SerdeError } from "./errors";
export type AuthenticatedApiRequest = NextApiRequest & {
  user: AuthTokenPayload;
};
export const authenticated = (
  handler: (
    req: AuthenticatedApiRequest,
    res: NextApiResponse
  ) => void | Promise<void>
): NextApiHandler => async (req, res) => {
  let user: AuthTokenPayload;
  try {
    user = verifyAndDecodeToken(req.cookies[authCookieKey]);
  } catch (e) {
    new InvalidAuthToken(e).send(res);
    return;
  }
  try {
    await handler(Object.assign(req, { user }), res);
  } catch (e) {
    if (e instanceof BaseApiError) {
      e.send(res);
      return;
    } else if (e instanceof StructError) {
      new SerdeError(e).send(res);
    } else {
      throw e;
    }
  }
};
