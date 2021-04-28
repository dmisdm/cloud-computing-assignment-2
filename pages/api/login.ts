import { StatusCodes } from "http-status-codes";
import { BaseApiError } from "lib/api/errors";
import { setCookies } from "lib/cookies";
import { authCookieKey, encodePayload } from "lib/graphql/auth";
import { createStruct, Login } from "lib/types";
import type { NextApiRequest, NextApiResponse } from "next";

class InvalidCredentialsError extends BaseApiError {
  message = "Email or password is incorrect";
  statusCode = StatusCodes.BAD_REQUEST;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const body = Login.LoginRequest.create(req.body);
  if (body.id !== "test@test" || body.password !== "test") {
    new InvalidCredentialsError().send(res);
  } else {
    const { token, exp } = encodePayload({
      userId: "test",
      userName: "Test User",
    });
    setCookies(res, [{ name: authCookieKey, value: token }]);
    res.send(
      createStruct(Login.LoginSuccess, {
        id: "test@test",
        name: "Test User",
        expiry: exp,
      })
    );
  }
};
