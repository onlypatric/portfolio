import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type RotateProps = MotionProps & { angle?: number };
export function Rotate(props: RotateProps) { return <MotionView {...props} name="Rotate" effect="rotate" />; }
