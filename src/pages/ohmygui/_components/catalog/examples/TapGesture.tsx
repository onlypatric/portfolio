import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { TapGesture } from "@/_components/common/ohmygui/behavior/TapGesture";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="md" align="start">
      <TapGesture debounce={300} onTap={() => setCount((value) => value + 1)}>Tap or press Enter</TapGesture>
      <Text as="p" role="status">Accepted {count} taps. Repeats inside 300ms are ignored.</Text>
      </VStack>
  );
}
