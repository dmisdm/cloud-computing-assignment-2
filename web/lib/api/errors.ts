import { StatusCodes } from "http-status-codes";
import { NextApiResponse } from "next";
import { createApiError } from "web/lib/types";

export abstract class BaseApiError<Details = unknown> {
  abstract message: string;
  abstract statusCode: StatusCodes;
  constructor(public details?: Details) {}

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
