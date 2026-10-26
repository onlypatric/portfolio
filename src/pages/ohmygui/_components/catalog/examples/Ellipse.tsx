import { useState } from "react";
import { Ellipse, Grid, Picker, VStack } from "@/ohmygui";

export default function Example() {
  const [rx, setRx] = useState("220");
  const [ry, setRy] = useState("100");

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={160} gap="sm">
        <Picker label="Horizontal radius" value={rx} onChange={(event) => setRx(event.currentTarget.value)} items={[{ value: "120", label: "120 px" }, { value: "180", label: "180 px" }, { value: "220", label: "220 px" }]} />
        <Picker label="Vertical radius" value={ry} onChange={(event) => setRy(event.currentTarget.value)} items={[{ value: "60", label: "60 px" }, { value: "100", label: "100 px" }, { value: "140", label: "140 px" }]} />
      </Grid>
      <Ellipse
        aria-label={`Ellipse with ${rx} pixel horizontal and ${ry} pixel vertical radii`}
        rx={Number(rx)}
        ry={Number(ry)}
        fill="var(--accent)"
        stroke="var(--foreground)"
        strokeWidth={4}
      />
    </VStack>
  );
}
