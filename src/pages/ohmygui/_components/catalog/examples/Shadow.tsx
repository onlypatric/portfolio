import { Shadow } from "@/_components/common/ohmygui/drawing/Shadow";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Shadow level="lg" style={{ padding: 32, background: "var(--surface)", borderRadius: 16, margin: 16 }}>
      <Text as="p" weight="semibold">A little elevation.</Text>
      </Shadow>
  );
}
