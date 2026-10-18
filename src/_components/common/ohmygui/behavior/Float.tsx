import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type FloatProps = MotionProps & { distance?: number };
export function Float({ duration = 2400, repeat = true, ...props }: FloatProps) { return <MotionView {...props} name="Float" effect="float" duration={duration} repeat={repeat} />; }
