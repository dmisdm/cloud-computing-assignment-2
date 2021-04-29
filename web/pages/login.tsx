import { Box, Button, Card, TextField, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { x } from "@xstyled/emotion";
import { FormTextField } from "web/components/FormTextField";
import { NavBar } from "web/components/NavBar";
import { useLoginMutation, useUser } from "web/lib/state/User";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Login } from "lib/types";
import { FormError } from "components/FormError";

export default function LoginPage() {
  const loginMutation = useLoginMutation();
  const { state: state } = useUser(false);
  const { register, handleSubmit, formState } = useForm<
    typeof Login.LoginRequest.TYPE
  >();

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
                state.user.set(data);
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
              name="email"
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
            {loginMutation.error && <FormError error={loginMutation.error} />}
          </Card>
          <Button onClick={() => router.push("/register")} fullWidth>
            Register
          </Button>
        </form>
      </x.main>
    </x.div>
  );
}
