import { RoundedRectangle } from "@/_components/common/ohmygui/drawing/RoundedRectangle";

export default function Example() {
  return (
    <RoundedRectangle aria-label="Rounded green rectangle" width={220} height={120} radius={28} fill="var(--accent)" />
  );
}
