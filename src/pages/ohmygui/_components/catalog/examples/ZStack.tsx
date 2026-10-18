import { ZStack } from "@/_components/common/ohmygui/layout/ZStack";
import { Circle } from "@/_components/common/ohmygui/drawing/Circle";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <ZStack style={{ height: 180, background: "var(--surface-secondary)", borderRadius: 16 }}>
      <Circle diameter={120} fill="var(--ui-selection)" />
      <Badge variant="accent" style={{ zIndex: 1 }}>On top</Badge>
      </ZStack>
  );
}
