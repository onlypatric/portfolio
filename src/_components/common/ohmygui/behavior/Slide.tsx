import { MotionView } from "./_Motion";
import type { MotionDirection, MotionProps } from "./_motion-types";
export type SlideProps = MotionProps & { direction?: MotionDirection; distance?: number };
export function Slide(props: SlideProps) { return <MotionView {...props} name="Slide" effect="slide" />; }
