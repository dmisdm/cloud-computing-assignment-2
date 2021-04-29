import { authCookieKey, verifyAndDecodeToken } from "lib/auth";
import { AuthTokenPayload } from "lib/types";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
export type AuthenticatedApiRequest = NextApiRequest & {
  user: AuthTokenPayload;
};
export const authenticated = (
  handler: (req: AuthenticatedApiRequest, res: NextApiResponse) => void
): NextApiHandler => (req, res) => {
  const user = verifyAndDecodeToken(req.cookies[authCookieKey]);
  handler(Object.assign(req, { user }), res);
};
