import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type FadeProps = MotionProps;
export function Fade(props: FadeProps) { return <MotionView {...props} name="Fade" effect="fade" />; }
