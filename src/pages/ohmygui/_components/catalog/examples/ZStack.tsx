import { useState } from "react";
import { Badge, Circle, Grid, Picker, Surface, VStack, ZStack } from "@/ohmygui";

export default function Example() {
  const [align, setAlign] = useState<"top" | "center" | "bottom">("bottom");
  const [justify, setJustify] = useState<"left" | "center" | "right">("right");

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Vertical alignment" value={align} onChange={(event) => setAlign(event.currentTarget.value as typeof align)} items={[{ value: "top", label: "Top" }, { value: "center", label: "Center" }, { value: "bottom", label: "Bottom" }]} />
        <Picker label="Horizontal alignment" value={justify} onChange={(event) => setJustify(event.currentTarget.value as typeof justify)} items={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />
      </Grid>
      <Surface padding="md">
        <ZStack as="section" aria-label="Overlapping badge on a circle" align={align} justify={justify}>
          <Circle diameter={120} fill="var(--ui-selection)" />
          <Badge variant="accent">Overlay</Badge>
        </ZStack>
      </Surface>
    </VStack>
  );
}
