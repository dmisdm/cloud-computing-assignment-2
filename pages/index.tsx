import { Container, Typography } from "@material-ui/core";
import { x } from "@xstyled/emotion";
import { NavBar } from "components/NavBar";
import { useUser } from "lib/state/User";
import React from "react";

export default function Home() {
  useUser();
  return (
    <>
      <NavBar />
      <Container>
        <Typography variant="h2">Hey buddy</Typography>
      </Container>
    </>
  );
}
