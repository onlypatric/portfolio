import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { DragGesture } from "@/_components/common/ohmygui/behavior/DragGesture";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <VStack gap="md">
      <div style={{ minHeight: 200, padding: 12, background: "var(--surface-secondary)", borderRadius: 16 }}>
      <DragGesture aria-label="Move this tile with a pointer or arrow keys" role="button" bounds={{ left: 0, right: 40, top: 0, bottom: 60 }} snap={10} onDrag={setOffset} style={{ width: 140, padding: 24, background: "var(--ui-selection)" }}>Move me</DragGesture>
      </div>
      <Text as="p" role="status">Position: {offset.x}, {offset.y}</Text>
      </VStack>
  );
}
