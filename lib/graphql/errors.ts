export class BaseError<Details = unknown> extends Error {
  details?: Details;
  constructor(message?: string) {
    super(message);
  }
}
export class InvalidAuthToken extends BaseError<string> {
  constructor(public details: string) {
    super("Invalid authentication token");
  }
}
