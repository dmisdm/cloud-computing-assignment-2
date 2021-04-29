import { StatusCodes } from "http-status-codes";
import { BaseApiError } from "lib/api/errors";
import { authenticated } from "lib/api/middlewares";
import { subscriptionService } from "lib/services/root";
import { Subscriptions } from "lib/types";
import { object, string } from "superstruct";
const PostSubscriptionRequest = object({
  songId: string(),
});
class InvalidSubscription extends BaseApiError {
  message = "Invalid subscription request";
  statusCode = StatusCodes.BAD_REQUEST;
}
type PostSubscriptionRequest = typeof PostSubscriptionRequest.TYPE;

export default authenticated(async (req, res) => {
  const body = PostSubscriptionRequest.create(req.body);
  const response = await subscriptionService.subscribeUserToSong({
    email: req.user.email,
    songId: body.songId,
  });

  if (Subscriptions.Subscription.is(response)) {
    res.send(response);
  } else {
    new InvalidSubscription().send(res);
  }
});
