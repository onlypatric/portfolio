import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Draggable } from "@/_components/common/ohmygui/behavior/Draggable";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  return (
    <VStack gap="md" align="start">
      <Draggable payload="Water the seedlings" tabIndex={0} style={{ padding: 20, background: "var(--ui-selection)", borderRadius: 12 }}>Water the seedlings</Draggable>
      <Text as="p" color="muted">Drag the task to another app.</Text>
    </VStack>
  );
}
