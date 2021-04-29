import { authenticated } from "lib/api/middlewares";
import { subscriptionService } from "lib/services/root";

export default authenticated(async (req, res) => {
  res.send(await subscriptionService.subscriptionsForUser(req.user.email));
});
