import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type ScaleProps = MotionProps & { fromScale?: number };
export function Scale({ fromScale = .92, ...props }: ScaleProps) { return <MotionView {...props} name="Scale" effect="scale" scale={fromScale} />; }
