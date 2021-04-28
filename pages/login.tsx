import { Box, Button, Card, TextField, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { x } from "@xstyled/emotion";
import { FormTextField } from "components/FormTextField";
import { NavBar } from "components/NavBar";
import { useLoginMutation, useUser } from "lib/state/User";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function Login() {
  const loginMutation = useLoginMutation();
  const { state } = useUser(false);
  const { register, handleSubmit, formState } = useForm<{
    id: string;
    password: string;
  }>();

  const router = useRouter();
  return (
    <x.div w="100%" h="100%" display="flex" flexDirection="column">
      <NavBar />
      <x.main
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="center"
        alignItems="center"
      >
        <form
          onSubmit={handleSubmit((form) =>
            loginMutation.mutate(form, {
              onSuccess: (data) => {
                state.user.set({
                  id: data.id,
                  name: data.name,
                  expiry: data.expiry,
                });
                router.push("/");
              },
            })
          )}
        >
          <Card
            style={{
              width: "20rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <FormTextField
              label="Email"
              formState={formState}
              register={register}
              required
              name="id"
              autoComplete="email"
              type="email"
            />
            <FormTextField
              label="Password"
              formState={formState}
              register={register}
              required
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <Button type="submit" variant="outlined" color="primary">
              Login
            </Button>
            {loginMutation.error && (
              <Typography variant="caption" color="error">
                {typeof loginMutation.error === "string"
                  ? loginMutation.error
                  : loginMutation.error.errorMessage}
              </Typography>
            )}
          </Card>
        </form>
      </x.main>
    </x.div>
  );
}
