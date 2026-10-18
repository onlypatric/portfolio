import { MotionView } from "./_Motion";
import type { MotionDirection, MotionProps } from "./_motion-types";
export type RevealProps = MotionProps & { direction?: MotionDirection };
export function Reveal(props: RevealProps) { return <MotionView {...props} name="Reveal" effect="reveal" />; }
