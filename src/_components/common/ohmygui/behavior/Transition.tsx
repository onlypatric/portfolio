import { MotionView } from "./_Motion";
import type { MotionDirection, MotionEffect, MotionProps } from "./_motion-types";

export type TransitionProps = Omit<MotionProps, "visible"> & {
  active?: boolean;
  effect?: MotionEffect;
  direction?: MotionDirection;
  distance?: number;
  from?: string;
  to?: string;
  timing?: string;
};
export function Transition({ active = true, effect = "fade", from, to, timing, ...props }: TransitionProps) {
  return <MotionView {...props} name="Transition" effect={effect} visible={active} from={from} to={to} timing={timing} data-from={from} data-to={to} />;
}
