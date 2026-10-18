import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type BounceProps = MotionProps & { distance?: number };
export function Bounce({ duration = 650, ...props }: BounceProps) { return <MotionView {...props} name="Bounce" effect="bounce" duration={duration} />; }
