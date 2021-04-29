import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  props: {
    MuiContainer: {
      maxWidth: "md",
    },
  },
  typography: {
    fontFamily: "PT Mono, mono",
  },
});
