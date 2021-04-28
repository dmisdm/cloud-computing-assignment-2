import { StatusCodes } from "http-status-codes";
import { createApiError } from "lib/types";
import { NextApiResponse } from "next";

export abstract class BaseApiError<Details = unknown> {
  details?: Details;
  abstract message: string;
  abstract statusCode: StatusCodes;

  send(res: NextApiResponse) {
    res.status(this.statusCode);
    res.send(
      createApiError({
        errorMessage: this.message,
        detail: this.details,
        errorName: this.constructor.name,
      })
    );
  }
}
export class InvalidAuthToken extends BaseApiError<string> {
  message = "Invalid authentication token";
  statusCode = StatusCodes.BAD_REQUEST;
}
