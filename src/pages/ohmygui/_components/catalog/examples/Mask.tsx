import { useState } from "react";
import { HStack, Image, Mask, Picker, VStack } from "@/ohmygui";

type MaskShape = "circle" | "ellipse" | "rounded";
type MaskMode = "clip" | "mask";

export default function Example() {
  const [shape, setShape] = useState<MaskShape>("circle");
  const [mode, setMode] = useState<MaskMode>("clip");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Mask shape" value={shape} onChange={(event) => setShape(event.currentTarget.value as MaskShape)} items={[{ value: "circle", label: "Circle" }, { value: "ellipse", label: "Ellipse" }, { value: "rounded", label: "Rounded" }]} />
        <Picker label="Mask mode" value={mode} onChange={(event) => setMode(event.currentTarget.value as MaskMode)} items={[{ value: "clip", label: "Clip path" }, { value: "mask", label: "CSS mask" }]} />
      </HStack>
      <Mask shape={shape} mode={mode}>
        <Image
          src="/ohmygui/landscape.svg"
          alt={`Illustrated hills shown with a ${shape} ${mode}`}
          width={240}
          height={160}
          fit="cover"
        />
      </Mask>
    </VStack>
  );
}
