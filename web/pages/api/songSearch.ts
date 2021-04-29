import { authenticated } from "lib/api/middlewares";
import { songService } from "lib/services/root";
import { Music } from "lib/types";
import { filterNotNull } from "lib/utils";

export default authenticated(async (req, res) => {
  const body = Music.SongSearchRequest.create(req.body);
  const filters = ([
    body.artist && body.artist.length
      ? { key: "artist", value: body.artist, operator: "CONTAINS" }
      : null,
    body.title && body.title.length
      ? { key: "title", value: body.title, operator: "CONTAINS" }
      : null,
    body.year && body.year.length
      ? { key: "year", value: body.year, operator: "CONTAINS" }
      : null,
  ] as Parameters<typeof songService.search>[0]["filters"]).filter(
    filterNotNull
  );

  const result = await songService.search({
    filters,
    limit: body.limit,
  });
  res.send(result);
});
