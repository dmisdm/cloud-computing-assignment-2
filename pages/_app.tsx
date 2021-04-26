import "../styles/globals.css";
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
const theme = createMuiTheme();
import { createClient, Provider } from "urql";
import { Preflight } from "@xstyled/emotion";

const client = createClient({ url: "/api/graphql" });
function MyApp<Props>({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<Props>;
  pageProps: Props;
}) {
  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Preflight />
        <EmotionThemeProvider theme={theme}>
          <Component {...pageProps} />
        </EmotionThemeProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
