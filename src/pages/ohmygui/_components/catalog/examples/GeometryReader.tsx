import { GeometryReader } from "@/_components/common/ohmygui/layout/GeometryReader";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <GeometryReader style={{ padding: 24, background: "var(--surface-secondary)", borderRadius: 16 }}>{({ width, height }) => <Text as="p">This container is {Math.round(width)} × {Math.round(height)}px.</Text>}</GeometryReader>
  );
}
