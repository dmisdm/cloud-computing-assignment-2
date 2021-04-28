import { Container, Typography } from "@material-ui/core";
import { NavBar } from "components/NavBar";
import { useUser } from "lib/state/User";
import React from "react";

export default function Home() {
  const { state } = useUser();
  return (
    <>
      <NavBar />
      {state.value.user && (
        <Container>
          <Typography variant="h2">Hey buddy</Typography>
        </Container>
      )}
    </>
  );
}
