import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { Preflight, x } from "@xstyled/emotion";
import { QueryClient, QueryClientProvider } from "react-query";
import { createClient, Provider } from "urql";
import Head from "next/head";

import "../styles/globals.css";
const theme = createMuiTheme({
  typography: {
    fontFamily: "PT Mono, mono",
  },
});
const queryClient = new QueryClient();

const client = createClient({ url: "/api/graphql" });
function MyApp<Props>({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<Props>;
  pageProps: Props;
}) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap"
          rel="stylesheet"
        />
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
