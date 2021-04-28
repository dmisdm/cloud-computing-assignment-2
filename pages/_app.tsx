import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Preflight, x } from "@xstyled/emotion";
import { meta } from "lib/meta";
import { GetStaticPropsContext } from "next";
import Head from "next/head";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { createClient, Provider } from "urql";
import "../styles/globals.css";
import { hydrateCurrentUser } from "../lib/state/User";
import { theme } from "../lib/theme";

const queryClient = new QueryClient();

const client = createClient({ url: "/api/graphql" });

function MyApp<Props>({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<Props>;
  pageProps: Props;
}) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      <Head>
        <title>{meta.appName}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Provider value={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Preflight />

            <x.div h="100vh" w="100vw">
              <Component {...pageProps} />
            </x.div>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
