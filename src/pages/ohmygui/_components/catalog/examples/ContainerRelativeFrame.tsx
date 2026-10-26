import { useState } from "react";
import { ContainerRelativeFrame, Picker, Surface, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [axis, setAxis] = useState<"vertical" | "both">("vertical");

  return (
    <VStack gap="sm" align="stretch">
      <Picker label="Additional sizing axis" value={axis} onChange={(event) => setAxis(event.currentTarget.value as typeof axis)} items={[{ value: "vertical", label: "Vertical only" }, { value: "both", label: "Both axes" }]} />
      <Surface appearance="outlined" padding="sm" style={{ containerType: "inline-size" }}>
        <Text variant="metadata" color="muted">Horizontal · 70%</Text>
        <ContainerRelativeFrame fraction={0.7}>
          <Surface tone="accent" padding="sm">
            <Text>70% inline size</Text>
          </Surface>
        </ContainerRelativeFrame>
      </Surface>
      <Surface appearance="outlined" padding="sm" style={{ containerType: "size", height: 200 }}>
        <Text variant="metadata" color="muted">{axis === "both" ? "Both axes" : "Vertical"} · 45%</Text>
        <ContainerRelativeFrame axis={axis} fraction={0.45}>
          <Surface tone="success" padding="sm" style={{ height: "100%" }}>
            <Text>{axis === "both" ? "45% of width and height" : "45% of height"}</Text>
          </Surface>
        </ContainerRelativeFrame>
      </Surface>
    </VStack>
  );
}
