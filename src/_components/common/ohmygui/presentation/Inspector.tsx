import { Sheet, type SheetProps } from "./Sheet";
export type InspectorProps = SheetProps & { width?: string };
export function Inspector({ width = "24rem", style, ...props }: InspectorProps) {
  return <Sheet data-ui="Inspector" placement="end" style={{ "--ui-overlay-width": width, ...style }} {...props} />;
}
