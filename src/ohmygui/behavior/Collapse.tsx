import { MotionView } from "./_Motion";
import type { MotionProps } from "./_motion-types";
export type CollapseProps = MotionProps;
export function Collapse(props: CollapseProps) { return <MotionView {...props} name="Collapse" effect="collapse" />; }
