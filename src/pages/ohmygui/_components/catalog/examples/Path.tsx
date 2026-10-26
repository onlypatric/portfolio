import { useState } from "react";
import { Grid, Group, Path, Picker, VStack } from "@/ohmygui";

const paths = {
  curve: { label: "Open curve", d: "M20 95 C60 15 100 115 140 50 S200 15 220 25", fill: "none" },
  loop: { label: "Closed path", d: "M20 60 C20 10 220 10 220 60 C220 110 20 110 20 60 Z", fill: "var(--ui-selection)" },
} as const;

export default function Example() {
  const [geometry, setGeometry] = useState<keyof typeof paths>("curve");
  const [strokeWidth, setStrokeWidth] = useState("8");
  const path = paths[geometry];

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Path geometry" value={geometry} onChange={(event) => setGeometry(event.currentTarget.value as typeof geometry)} items={Object.entries(paths).map(([value, item]) => ({ value, label: item.label }))} />
        <Picker label="Stroke width" value={strokeWidth} onChange={(event) => setStrokeWidth(event.currentTarget.value)} items={[{ value: "4", label: "4 px" }, { value: "8", label: "8 px" }, { value: "12", label: "12 px" }]} />
      </Grid>
      <Group className="h-[180px] w-[360px] max-w-full">
        <Path
          aria-label={`${path.label} with ${strokeWidth} pixel stroke`}
          viewBox="0 0 240 120"
          d={path.d}
          fill={path.fill}
          stroke="var(--accent)"
          strokeWidth={Number(strokeWidth)}
          className="h-full w-full"
        />
      </Group>
    </VStack>
  );
}
