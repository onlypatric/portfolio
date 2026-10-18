import type { CSSProperties } from "react";

/** Native styles plus typed, locally scoped CSS custom properties. */
export type UIStyle = CSSProperties & { [token: `--${string}`]: string | number | undefined };

/** Shared appearance contract; native element attributes remain on each component. */
export type UIProps = {
  className?: string;
  style?: UIStyle;
};
