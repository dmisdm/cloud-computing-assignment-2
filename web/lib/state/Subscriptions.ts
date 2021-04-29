import { APIError, Subscriptions } from "lib/types";
import { useQuery } from "react-query";

export const useSubscriptionsQuery = () =>
  useQuery<Subscriptions.SubscriptionsPageResponse, APIError>(
    "subscriptions",
    () =>
      fetch("/api/subscriptions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (r) => {
        if (r.ok) {
          return Subscriptions.SubscriptionsPageResponse.create(await r.json());
        } else {
          throw APIError.create(await r.json());
        }
      })
  );
