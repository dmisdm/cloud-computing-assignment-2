import { authenticated } from "lib/api/middlewares";
import { subscriptionService } from "lib/services/root";

export default authenticated((req, res) => {
  res.json(subscriptionService.subscriptionsForUser(req.user.email));
});
