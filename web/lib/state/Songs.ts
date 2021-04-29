import { APIError, Music } from "lib/types";
import { useQuery, UseQueryOptions, QueryFunctionContext } from "react-query";
import { array } from "superstruct";
const SongSearchResponse = array(Music.SongItem);
type QueryKey = [string, Music.SongSearchRequest];
type SongSearchResponse = typeof SongSearchResponse.TYPE;
const fetcher = (context: QueryFunctionContext<QueryKey>) =>
  fetch("/api/songSearch", {
    method: "POST",
    body: JSON.stringify(context.queryKey[1]),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (r) => {
    if (r.ok) {
      return SongSearchResponse.create(await r.json());
    } else {
      throw APIError.create(await r.json());
    }
  });

export const songQueryKey = "song";
export const useSongSearchQuery = (
  params: Music.SongSearchRequest,
  options?: UseQueryOptions<
    typeof SongSearchResponse.TYPE,
    APIError,
    SongSearchResponse,
    QueryKey
  >
) => useQuery([songQueryKey, params], fetcher, { retry: false, ...options });
