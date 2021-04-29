import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Typography,
  useTheme,
} from "@material-ui/core";
import { NavBar } from "components/NavBar";
import { useUser } from "lib/state/User";
import React from "react";
import {
  useSubscribeToSongMutation,
  useSubscriptionsQuery,
  useUnsubscribeToSongMutation,
} from "lib/state/Subscriptions";
import { x } from "@xstyled/emotion";
import { Padding } from "components/Padding";
import { Music, Subscriptions } from "lib/types";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { FormTextField } from "components/FormTextField";
import { useSongSearchQuery } from "lib/state/Songs";
import { useState } from "@hookstate/core";

const SongTile = ({
  song,
  topElement,
}: {
  song: Music.SongItem;
  topElement?: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <x.div
      key={song.id}
      w="12rem"
      flexShrink={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {topElement}
      <x.img
        boxShadow={theme.shadows[8]}
        borderRadius={theme.shape.borderRadius}
        src={song.img_url}
        objectFit="cover"
        h="7rem"
        w="7rem"
      />
      <Padding size={0.5} />
      <x.div textAlign="center">
        <Typography variant="caption" align="center">
          <strong>{song.title}</strong>
        </Typography>
        <br />
        <Typography variant="caption" align="center">
          {song.artist}
        </Typography>
        <br />
        <Typography variant="caption" align="center">
          {song.year}
        </Typography>
      </x.div>
    </x.div>
  );
};

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
  const {
    register,
    formState,
    handleSubmit,
    getValues,
  } = useForm<Music.SongSearchRequest>();
  const { state: userState } = useUser();
  const [queryKey, setQueryKey] = React.useState(getValues());
  const { data, isLoading, error, refetch } = useSongSearchQuery(queryKey, {
    enabled: formState.isSubmitted,
  });
  const subscriptionsQuery = useSubscriptionsQuery();
  const subscribeToSongMutation = useSubscribeToSongMutation();

  return (
    <x.div h="30rem" display="flex" flexDirection="column">
      <Typography variant="h6" align="center">
        Song search
      </Typography>
      <x.form
        display="flex"
        gap="1rem"
        justifyContent="center"
        alignItems="flex-end"
        onSubmit={handleSubmit((values) => {
          setQueryKey(values);
        })}
      >
        <FormTextField
          register={register}
          formState={formState}
          name="title"
          label="Title"
          autoComplete=""
        />
        <FormTextField
          register={register}
          formState={formState}
          name="artist"
          label="Artist"
          autoComplete=""
        />
        <FormTextField
          register={register}
          formState={formState}
          name="year"
          label="Year"
          autoComplete=""
        />
        <Button type="submit">Search</Button>
      </x.form>
      <Padding size={2} />
      <x.div
        row
        gap="2rem"
        justifyContent="center"
        flexWrap="wrap"
        overflow="auto"
        flex={1}
      >
        {isLoading && "Searching..."}
        {error && error.errorMessage}

        {data &&
          (!data.length ? (
            <Typography>No result is retrieved. Please query again</Typography>
          ) : (
            data.map((song) => {
              const subscriptionExists = !!subscriptionsQuery.data?.find(
                (item) => item.song.id === song.id
              );
              return (
                <SongTile
                  key={song.id}
                  song={song}
                  topElement={
                    <Button
                      disabled={subscriptionExists}
                      onClick={() =>
                        subscribeToSongMutation.mutate({
                          songId: song.id,
                          email: userState.value.user?.email || "",
                        })
                      }
                    >
                      {subscriptionExists ? "Subscribed" : "Subscribe"}
                    </Button>
                  }
                />
              );
            })
          ))}
        <x.div w="100%" />
      </x.div>
    </x.div>
  );
};

const SubscriptionsArea = () => {
  const { data, isLoading, error } = useSubscriptionsQuery();
  const unsubscribe = useUnsubscribeToSongMutation();
  return (
    <>
      <Typography variant="h3">Subscriptions</Typography>
      <Padding />
      {error ? (
        <Typography>{error.errorMessage}</Typography>
      ) : isLoading ? (
        <Typography>Loading subscriptions...</Typography>
      ) : !data || !data.length ? (
        <Typography>No subscriptions found!</Typography>
      ) : (
        <x.div display="flex" gap="1rem" flexWrap="wrap">
          {data.map((item) => (
            <SongTile
              topElement={
                <Button
                  onClick={() => unsubscribe.mutate({ songId: item.song.id })}
                >
                  Remove
                </Button>
              }
              key={item.song.id}
              song={item.song}
            />
          ))}
        </x.div>
      )}
    </>
  );
};
export default function Home() {
  useUser();

  return (
    <>
      <NavBar />
      <Container>
        <Padding size={2} />
        <SongSearch />
        <Padding size={2} />
        <SubscriptionsArea />
        <Padding />
      </Container>
    </>
  );
}
