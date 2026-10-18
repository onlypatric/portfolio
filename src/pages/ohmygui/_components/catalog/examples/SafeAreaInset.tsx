import { SafeAreaInset } from "@/_components/common/ohmygui/layout/SafeAreaInset";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <SafeAreaInset edges={["bottom", "leading", "trailing"]} spacing="md" style={{ background: "var(--surface-secondary)", borderRadius: 16 }}>
      <Text as="p">Safe from the edges.</Text>
      </SafeAreaInset>
  );
}
