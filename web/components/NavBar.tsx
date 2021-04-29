import { Box, Button, TextField, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { x } from "@xstyled/emotion";
import { useUser } from "web/lib/state/User";
import Search from "@material-ui/icons/Search";
import { meta } from "web/lib/meta";
export function NavBar() {
  const theme = useTheme();
  const { state: state, logout } = useUser(false);
  return (
    <x.header
      position="sticky"
      top={0}
      display="grid"
      gridTemplateColumns="minmax(10rem, 1fr) 1fr 1fr"
      gap="1rem"
      alignItems="center"
      p="1rem"
      borderBottom={`solid 1px ${theme.palette.grey[300]}`}
      w="100%"
    >
      <Box clone flexShrink={0}>
        <Typography variant="h5">{meta.appName}</Typography>
      </Box>

      <div />
      {state.value.user && (
        <x.div row justifyContent="flex-end">
          <Button onClick={() => logout()}>Logout</Button>
        </x.div>
      )}
    </x.header>
  );
}
