import { StatusCodes } from "http-status-codes";
import { BaseApiError } from "lib/api/errors";
import { setCookies } from "lib/cookies";
import { authCookieKey } from "lib/auth";
import { createStruct, Login } from "web/lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { userService } from "lib/services/root";

class InvalidCredentialsError extends BaseApiError {
  message = "Email or password is incorrect";
  statusCode = StatusCodes.BAD_REQUEST;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = Login.LoginRequest.create(req.body);
  const credentialsValidationResult = await userService.validateCredentials(
    body
  );
  if (!credentialsValidationResult) {
    new InvalidCredentialsError().send(res);
  } else {
    const { token, exp } = credentialsValidationResult;
    setCookies(res, [{ name: authCookieKey, value: token }]);
    res.send(
      createStruct(Login.LoginSuccess, {
        email: "test@test",
        username: "Test User",
        exp,
      })
    );
  }
};
