import { TextField } from "@material-ui/core";
import {
  FieldPath,
  FieldValues,
  FormState,
  Path,
  UseFormRegister,
  get,
} from "react-hook-form";

export function FormTextField<
  FormValues extends FieldValues,
  Name extends FieldPath<FormValues>
>({
  formState,
  name,
  register,
  required,
  label,
  ...props
}: React.ComponentPropsWithoutRef<typeof TextField> & {
  label: string;
  name: Name;
  formState: FormState<FormValues>;
  register: UseFormRegister<FormValues>;
  required?: boolean;
}) {
  return (
    <TextField
      {...props}
      label={label}
      error={!!formState.touchedFields[name] && !!formState.errors[name]}
      helperText={
        !!formState.touchedFields[name] && get(formState.errors, name)?.message
      }
      InputProps={register(name, {
        required: required ? `${label} is required` : undefined,
      })}
    />
  );
}
