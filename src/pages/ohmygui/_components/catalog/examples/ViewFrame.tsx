import { ViewFrame } from "@/_components/common/ohmygui/layout/ViewFrame";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <ViewFrame width={240} height={140} style={{ maxWidth: "100%", display: "grid", placeItems: "center", background: "var(--ui-selection)", borderRadius: 16 }}>
      <Text>240 × 140 frame</Text>
      </ViewFrame>
  );
}
