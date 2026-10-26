import { MotionView } from "./_Motion";
import { motionEffect } from "./_motion-presets";
import type { MotionEffect, MotionProps, MotionDirection } from "./_motion-types";

export type AnimationProps = MotionProps & {
  effect?: MotionEffect;
  enter?: string;
  exit?: string;
  direction?: MotionDirection;
  distance?: number;
  motionToken?: "gentle" | "snappy" | "spring";
};
export function Animation({ effect = "fade", enter, exit, motionToken = "gentle", ...props }: AnimationProps) {
  return <MotionView {...props} name="Animation" effect={motionEffect(enter ?? effect)} exitEffect={motionEffect(exit ?? enter ?? effect)} motionToken={motionToken}
    data-enter={enter ?? effect} data-exit={exit ?? effect} data-motion-token={motionToken} />;
}
