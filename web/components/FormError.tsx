import { Typography } from "@material-ui/core";
import { APIError } from "lib/types";

export const FormError = ({
  error,
}: {
  error: typeof APIError.TYPE | string;
}) => {
  return (
    <Typography variant="caption" color="error">
      {typeof error === "string" ? error : error.errorMessage}
    </Typography>
  );
};
