import { x } from "@xstyled/emotion";

export const Padding = ({ size = 1 }: { size?: number }) => (
  <x.div w={`${size}rem`} h={`${size}rem`} />
);
