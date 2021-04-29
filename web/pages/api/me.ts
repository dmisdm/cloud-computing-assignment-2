import { authCookieKey, verifyAndDecodeToken } from "web/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const user = verifyAndDecodeToken(req.cookies[authCookieKey]);
  res.send(user);
};
