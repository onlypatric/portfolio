import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type ShakeProps = MotionProps & { distance?: number };
export function Shake({ duration = 450, ...props }: ShakeProps) { return <MotionView {...props} name="Shake" effect="shake" duration={duration} />; }
