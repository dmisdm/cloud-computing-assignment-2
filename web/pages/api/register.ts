import { StatusCodes } from "http-status-codes";
import { BaseApiError } from "lib/api/errors";
import { userService } from "lib/services/root";

import { createStruct, RegisterPage } from "lib/types";
import { NextApiRequest, NextApiResponse } from "next";

export class EmailAlreadyExists extends BaseApiError<string> {
  message = "The email already exists";
  statusCode = StatusCodes.BAD_REQUEST;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const body = RegisterPage.RegistrationRequest.create(req.body);
  const result = await userService.registerUser(body);
  if (result === "EmailExists") {
    return new EmailAlreadyExists().send(res);
  } else {
    res.send(createStruct(RegisterPage.RegistrationSucessResponse, result));
  }
}
