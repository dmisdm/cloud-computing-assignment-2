import { createState, useState } from "@hookstate/core";
import {
  APIError,
  AuthTokenPayload,
  authTokenPayload,
  Login,
  RegisterPage,
} from "web/lib/types";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
import { Persistence } from "@hookstate/persistence";
import { queryClient } from "./queryClient";
export type UserState = {
  hydrated: boolean;
  user: AuthTokenPayload | null;
};

export const userState = createState<UserState>({
  hydrated: false,
  user: null,
});

export const hydrateCurrentUser = () => {
  if (!userState.value.hydrated) {
    if (typeof window !== "undefined")
      userState.attach(Persistence("user-state"));
    userState.hydrated.set(true);

    if (userState.value.user) {
      // Re-fetch me to check if the user is still valid
      fetch("/api/me")
        .then(async (res) => {
          const response = authTokenPayload.create(await res.json());
          userState.user.set(response);
        })
        .catch(() => {
          userState.user.set(null);
        });
    }
  }
};

if (typeof window !== "undefined") hydrateCurrentUser();

export const useUser = (redirectIfUnauthenticated: boolean = true) => {
  const state = useState(userState);
  const router = useRouter();

  React.useEffect(() => {
    if (
      !state.value.user &&
      state.value.hydrated &&
      redirectIfUnauthenticated
    ) {
      router.push("/login");
    }
  });
  return {
    state: state,
    logout: React.useCallback(() => {
      state.user.set(null);
      router.push("/login");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  };
};

export const useLoginMutation = () =>
  useMutation<
    typeof Login.LoginSuccess.TYPE,
    typeof APIError["TYPE"] | string,
    typeof Login.LoginRequest.TYPE
  >(
    "login",
    (params) =>
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (r) => {
        if (r.ok) {
          return Login.LoginSuccess.create(await r.json());
        } else {
          throw APIError.create(await r.json());
        }
      }),
    {
      onMutate: () => {
        queryClient.clear();
      },
    }
  );
export const useRegisterMutation = () =>
  useMutation<
    typeof RegisterPage.RegistrationSucessResponse.TYPE,
    typeof APIError["TYPE"] | string,
    typeof RegisterPage.RegistrationRequest.TYPE
  >("login", (params) =>
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (r) => {
      if (r.ok) {
        return RegisterPage.RegistrationSucessResponse.create(await r.json());
      } else {
        throw APIError.create(await r.json());
      }
    })
  );
