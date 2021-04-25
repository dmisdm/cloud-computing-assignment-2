import { Typography } from "@material-ui/core";
import { x } from "@xstyled/emotion";
import { useIndexPageQuery } from "lib/graphqlClient";
import React from "react";

export default function Home() {
  const [state] = useIndexPageQuery();
  return (
    <x.div
      h="100vh"
      display="grid"
      gridTemplateColumns="12rem 60em"
      gridTemplateRows="1fr"
      gap="1rem"
    >
      <x.div>
        <x.div position="sticky" top={0}>
          <Typography variant="h4">Company</Typography>
        </x.div>
      </x.div>
      <x.main>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
        <Typography paragraph variant="body2">
          Some content
        </Typography>
      </x.main>
    </x.div>
  );
}
