import type { ComponentPropsWithRef, RefObject } from "react";
import type { UIProps } from "../_types";

export type MotionEffect = "fade" | "slide" | "scale" | "rotate" | "flip" | "reveal" | "collapse" | "bounce" | "shake" | "pulse" | "float";
export type MotionDirection = "up" | "down" | "left" | "right" | "start" | "end";
export type MotionOptions = {
  visible?: boolean;
  /** Milliseconds; defaults to the theme's slow duration. */
  duration?: number;
  delay?: number;
  easing?: string;
  /** Replay a completed entrance after leaving/re-entering the viewport. */
  once?: boolean;
  /** true loops; a number is the total iteration count. */
  repeat?: boolean | number;
  /** Change this value to replay without remounting children. */
  replayKey?: string | number;
  disabled?: boolean;
  /** Optional ancestor scroll root; the viewport is the default. */
  root?: Element | null;
  /** Keep children through exit, then remove them. Default retains state/layout. */
  unmountOnExit?: boolean;
  exitFocusRef?: RefObject<HTMLElement | null>;
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
};
export type MotionProps = UIProps & ComponentPropsWithRef<"div"> & MotionOptions;
export type MotionSettings = MotionOptions & {
  effect: MotionEffect;
  exitEffect?: MotionEffect;
  direction?: MotionDirection;
  distance?: number;
  scale?: number;
  angle?: number;
  axis?: "x" | "y";
  motionToken?: "gentle" | "snappy" | "spring";
  from?: string;
  to?: string;
  timing?: string;
};
