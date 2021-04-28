import { createState, useState } from "@hookstate/core";
import { APIError, Login } from "lib/types";
import { useRouter } from "next/router";
import React from "react";
import { useMutation } from "react-query";
export type UserState = {
  user?: {
    id: string;
    name: string;
    expiry: Date;
  };
};
export const userState = createState<UserState>({});

export const useUser = (redirectIfUnauthenticated: boolean = true) => {
  const router = useRouter();
  const state = useState(userState);
  React.useEffect(() => {
    if (!state.get().user && redirectIfUnauthenticated) {
      router.push("/login");
    }
  });

  return state;
};

export const useLoginMutation = () =>
  useMutation<
    typeof Login.LoginSuccess.TYPE,
    typeof APIError["TYPE"] | string,
    { id: string; password: string }
  >("login", (params) =>
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
    })
  );
