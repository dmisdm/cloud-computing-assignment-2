import { APIError, Music, Subscriptions } from "lib/types";
import {
  MutationFunction,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "react-query";
import { queryClient } from "./queryClient";
import { songQueryKey } from "./Songs";
const querier = () => {
  const controller = new AbortController();
  const promise = fetch("/api/subscriptions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal,
  }).then(async (r) => {
    if (r.ok) {
      return Subscriptions.SubscriptionsPageResponse.create(await r.json());
    } else {
      throw APIError.create(await r.json());
    }
  });
  return Object.assign(promise, { cancel: () => controller.abort() });
};
const subscriptionsQueryKey = "subscriptions";
export const useSubscriptionsQuery = (
  options?: UseQueryOptions<
    Subscriptions.SubscriptionsPageResponse,
    APIError,
    Subscriptions.SubscriptionsPageResponse,
    string
  >
) =>
  useQuery<
    Subscriptions.SubscriptionsPageResponse,
    APIError,
    Subscriptions.SubscriptionsPageResponse,
    string
  >(subscriptionsQueryKey, querier, options);

const subscribeToSongMutator: MutationFunction<
  Subscriptions.Subscription,
  { songId: string; email: string }
> = ({ songId }) =>
  fetch("/api/subscribe", {
    method: "POST",
    body: JSON.stringify({ songId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (r) => {
    if (r.ok) {
      return Subscriptions.Subscription.create(await r.json());
    } else {
      throw APIError.create(await r.json());
    }
  });
export const useSubscribeToSongMutation = () =>
  useMutation("subscribeToSong", subscribeToSongMutator, {
    onMutate: async ({ songId, email }) => {
      await queryClient.cancelQueries(subscriptionsQueryKey);
      const song = queryClient
        .getQueryData<Music.SongItem[]>(songQueryKey, { exact: false })
        ?.find((item) => item.id === songId);
      if (song) {
        queryClient.setQueryData(
          subscriptionsQueryKey,
          (data?: Subscriptions.SubscriptionsPageResponse) => [
            ...(data || []),
            {
              email,
              song,
              subscribedAt: new Date(),
            },
          ]
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(subscriptionsQueryKey);
    },
  });

const unsubscribeMutator: MutationFunction<void, { songId: string }> = ({
  songId,
}) =>
  fetch("/api/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ songId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (r) => {
    if (r.ok) {
      return;
    } else {
      throw APIError.create(await r.json());
    }
  });

const unsubscribeMutationKey = "unsubscribeToSong";
export const useUnsubscribeToSongMutation = () =>
  useMutation(unsubscribeMutationKey, unsubscribeMutator, {
    onMutate: async ({ songId }) => {
      await queryClient.cancelQueries(subscriptionsQueryKey);
      queryClient.setQueryData(
        subscriptionsQueryKey,
        (data?: Subscriptions.SubscriptionsPageResponse) =>
          data?.filter((item) => item.song.id !== songId) || []
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(subscriptionsQueryKey);
    },
  });
