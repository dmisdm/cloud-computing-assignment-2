import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Preflight, x } from "@xstyled/emotion";
import { queryClient } from "lib/state/queryClient";
import { theme } from "lib/theme";
import Head from "next/head";
import React from "react";
import { QueryClientProvider } from "react-query";
import { meta } from "web/lib/meta";

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Preflight />

          <x.div h="100vh" w="100vw" overflowY="auto" overflowX="hidden">
            <Component {...pageProps} />
          </x.div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
