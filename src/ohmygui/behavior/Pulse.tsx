import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type PulseProps = MotionProps & { scale?: number };
export function Pulse({ duration = 1600, repeat = true, ...props }: PulseProps) { return <MotionView {...props} name="Pulse" effect="pulse" duration={duration} repeat={repeat} />; }
