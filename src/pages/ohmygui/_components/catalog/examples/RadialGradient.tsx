import { useState } from "react";
import { Grid, Group, Picker, RadialGradient, Surface, VStack } from "@/ohmygui";

export default function Example() {
  const [center, setCenter] = useState("35% 35%");
  const [radius, setRadius] = useState("closest-side");

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Gradient center" value={center} onChange={(event) => setCenter(event.currentTarget.value)} items={[{ value: "35% 35%", label: "Upper left" }, { value: "center", label: "Center" }, { value: "75% 70%", label: "Lower right" }]} />
        <Picker label="Gradient radius" value={radius} onChange={(event) => setRadius(event.currentTarget.value)} items={["closest-side", "closest-corner", "farthest-side", "farthest-corner"].map((value) => ({ value, label: value }))} />
      </Grid>
      <Group className="h-[180px] w-full">
        <Surface padding="none" radius="lg" className="h-full overflow-hidden">
          <RadialGradient
            aria-label={`Radial gradient at ${center}, sized to ${radius}`}
            role="img"
            colors={["var(--accent)", "var(--ui-selection)", "var(--surface)"]}
            center={center}
            radius={radius}
            className="h-full w-full"
          />
        </Surface>
      </Group>
    </VStack>
  );
}
