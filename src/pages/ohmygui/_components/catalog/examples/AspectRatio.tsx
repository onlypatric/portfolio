import { AspectRatio } from "@/_components/common/ohmygui/layout/AspectRatio";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <AspectRatio ratio="16 / 9" style={{ maxWidth: 420, background: "var(--ui-selection)", borderRadius: 16, display: "grid", placeItems: "center" }}>
      <Text weight="semibold">16 : 9</Text>
      </AspectRatio>
  );
}
