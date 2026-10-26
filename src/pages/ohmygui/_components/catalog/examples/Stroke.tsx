import { useState } from "react";
import { HStack, Padding, Picker, Stroke, Surface, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [width, setWidth] = useState("2");
  const [dashed, setDashed] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap align="center">
        <Picker label="Stroke width" value={width} onChange={(event) => setWidth(event.currentTarget.value)} items={[{ value: "1", label: "1 px" }, { value: "2", label: "2 px" }, { value: "4", label: "4 px" }]} />
        <Toggle label="Dashed border" checked={dashed} onChange={(event) => setDashed(event.currentTarget.checked)} />
      </HStack>
      <Stroke width={Number(width)} dash={dashed ? "dashed" : undefined}>
        <Surface tone="paper">
          <Padding padding="lg"><Text as="p">A clearly defined boundary.</Text></Padding>
        </Surface>
      </Stroke>
    </VStack>
  );
}
