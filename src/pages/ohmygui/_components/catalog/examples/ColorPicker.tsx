import { useState } from "react";
import { Background } from "@/_components/common/ohmygui/layout/Background";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { ColorPicker } from "@/_components/common/ohmygui/input/ColorPicker";
import { CodeText } from "@/_components/common/ohmygui/content/CodeText";

export default function Example() {
  const [color, setColor] = useState("#638463");
  return (
    <VStack gap="md">
      <ColorPicker label="Brand color" name="brandColor" value={color} onChange={(event) => setColor(event.target.value)} />
      <Background fill={color} style={{ height: 80, borderRadius: 16 }} />
      <CodeText inline>{color}</CodeText>
      </VStack>
  );
}
