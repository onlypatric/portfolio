import { Background } from "@/_components/common/ohmygui/layout/Background";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Background image="radial-gradient(circle at 15% 10%, var(--accent), transparent 55%), linear-gradient(120deg, var(--surface), var(--ui-selection))" decorativeBlur="16px" style={{ padding: 32, borderRadius: 16 }}>
      <Text as="p" variant="title">A softer surface.</Text>
      </Background>
  );
}
