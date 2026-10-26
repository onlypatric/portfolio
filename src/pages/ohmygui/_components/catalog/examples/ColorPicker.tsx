import { useState } from "react";
import { CodeText, ColorPicker, RoundedRectangle, VStack } from "@/ohmygui";

export default function Example() {
  const [color, setColor] = useState("#638463");
  return (
    <VStack gap="md">
      <ColorPicker
        label="Brand color"
        name="brandColor"
        helperText="Native opaque sRGB color · no alpha channel"
        value={color}
        onChange={(event) => setColor(event.target.value)}
      />
      <ColorPicker
        label="Accent color"
        name="accentColor"
        defaultValue="#b24a36"
        showValue={false}
      />
      <RoundedRectangle
        aria-label="Selected color preview"
        width={280}
        height={80}
        radius={16}
        fill={color}
      />
      <CodeText inline>{color}</CodeText>
    </VStack>
  );
}
