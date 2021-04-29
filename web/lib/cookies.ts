import { NextApiResponse } from "next";
import { CookieSerializeOptions, serialize } from "cookie";
export const setCookies = (
  res: NextApiResponse,
  cookies: { name: string; value: string; options?: CookieSerializeOptions }[]
) => {
  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie) =>
      serialize(cookie.name, cookie.value, cookie.options)
    )
  );
};
