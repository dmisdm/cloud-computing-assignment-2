import { Button, Card, Typography } from "@material-ui/core";
import { x } from "@xstyled/emotion";
import { FormError } from "components/FormError";
import { useRegisterMutation, useUser } from "lib/state/User";
import { RegisterPage } from "lib/types";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FormTextField } from "web/components/FormTextField";
import { NavBar } from "web/components/NavBar";

export default function LoginPage() {
  const registerMutation = useRegisterMutation();
  const { register, handleSubmit, formState } = useForm<
    typeof RegisterPage.RegistrationRequest.TYPE
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
            registerMutation.mutate(form, {
              onSuccess: (data) => {
                // Could log the user in here?
                //state.user.set(data);
                router.push("/login");
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
              label="Name"
              formState={formState}
              register={register}
              required
              name="name"
              autoComplete="name"
            />
            <FormTextField
              label="Password"
              formState={formState}
              register={register}
              required
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <Button type="submit" variant="outlined" color="primary">
              Register
            </Button>
            {registerMutation.error && (
              <FormError error={registerMutation.error} />
            )}
          </Card>
        </form>
      </x.main>
    </x.div>
  );
}
