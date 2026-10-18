import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { LongPressGesture } from "@/_components/common/ohmygui/behavior/LongPressGesture";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="md">
      <LongPressGesture duration={600} onLongPress={() => setCount((value) => value + 1)} style={{ padding: 24, background: "var(--ui-selection)" }}>Hold for 600ms, or press Enter / Space.</LongPressGesture>
      <Text as="p" role="status">Activated {count} times.</Text>
      </VStack>
  );
}
