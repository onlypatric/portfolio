import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type FlipProps = MotionProps & { axis?: "x" | "y"; angle?: number };
export function Flip(props: FlipProps) { return <MotionView {...props} name="Flip" effect="flip" />; }
