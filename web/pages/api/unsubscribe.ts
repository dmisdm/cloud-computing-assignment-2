import { StatusCodes } from "http-status-codes";
import { authenticated } from "lib/api/middlewares";
import { subscriptionService } from "lib/services/root";
import { object, string } from "superstruct";
const DeleteSubscriptionRequest = object({
  songId: string(),
});

export default authenticated(async (req, res) => {
  const body = DeleteSubscriptionRequest.create(req.body);
  await subscriptionService.unsubscribeUserFromSong({
    email: req.user.email,
    songId: body.songId,
  });
  res.send(undefined);
});
