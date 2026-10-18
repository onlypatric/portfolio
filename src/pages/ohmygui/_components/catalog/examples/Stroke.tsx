import { Stroke } from "@/_components/common/ohmygui/drawing/Stroke";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <Stroke width={2} dash="6 4" style={{ padding: 24, borderRadius: 16 }}>
      <Text as="p">A clearly defined boundary.</Text>
      </Stroke>
  );
}
