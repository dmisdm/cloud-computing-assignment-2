import {
  Button,
  Card,
  CardMedia,
  Container,
  Typography,
} from "@material-ui/core";
import { NavBar } from "components/NavBar";
import { useUser } from "lib/state/User";
import React from "react";
import { useSubscriptionsQuery } from "lib/state/Subscriptions";
import { x } from "@xstyled/emotion";
import { Padding } from "components/Padding";
import { Subscriptions } from "lib/types";
import { useForm } from "react-hook-form";
import { FormTextField } from "components/FormTextField";

const SubscriptionsList = (props: {
  subscriptions: Subscriptions.SubscriptionsPageResponse;
}) => (
  <>
    <Typography variant="h3">Subscriptions</Typography>
    {props.subscriptions.map((sub) => (
      <Card key={sub.email + sub.song.id}>
        <x.div padding="1rem" col gap="1rem">
          <Typography variant="h4">
            <a target="_blank" href={sub.song.web_url}>
              {sub.song.title}
            </a>
          </Typography>
          <Typography variant="h5">{sub.song.artist}</Typography>
          <Typography variant="h5">{sub.song.year}</Typography>
        </x.div>
        <CardMedia>
          <img src={sub.song.img_url} />
        </CardMedia>
      </Card>
    ))}
  </>
);

const SongSearch = (props: {}) => {
  const { register, formState } = useForm<{
    title: string;
    artist: string;
    year: string;
  }>();
  return (
    <>
      <Typography variant="h6" align="center">
        Song search
      </Typography>
      <x.form row gap="1rem" justifyContent="center" alignItems="flex-end">
        <FormTextField
          register={register}
          formState={formState}
          name="title"
          label="Title"
        />
        <FormTextField
          register={register}
          formState={formState}
          name="artist"
          label="Artist"
        />
        <FormTextField
          register={register}
          formState={formState}
          name="year"
          label="Year"
        />
        <Button>Search</Button>
      </x.form>
    </>
  );
};

export default function Home() {
  const { state: userState } = useUser();
  const { data, isLoading, error } = useSubscriptionsQuery();

  return (
    <>
      <NavBar />
      <Container>
        <Padding />
        <SongSearch />
        {error ? (
          <Typography align="center">{error.errorMessage}</Typography>
        ) : isLoading ? (
          <Typography align="center">Loading subscriptions...</Typography>
        ) : !data || !data.length ? (
          <Typography align="center">No subscriptions found!</Typography>
        ) : (
          <> </>
        )}
        <Padding />
      </Container>
    </>
  );
}
