import { useState } from "react";
import { Gauge, Grid, Picker, Slider, VStack } from "@/ohmygui";

export default function Example() {
  const [used, setUsed] = useState(64);
  const [tone, setTone] = useState<"accent" | "success" | "warning" | "danger">("accent");
  return (
    <VStack gap="md" align="stretch">
      <Picker label="Ring tone" value={tone} onChange={(event) => setTone(event.currentTarget.value as typeof tone)} items={["accent", "success", "warning", "danger"].map((value) => ({ value, label: value }))} />
      <Grid columns={{ compact: 1, regular: 2 }} gap="md">
        <Gauge
          label="Storage used · linear"
          value={used}
          min={0}
          max={100}
          low={25}
          high={80}
          optimum={10}
          formatValue={(value) => value + "%"}
        />
        <Gauge
          appearance="ring"
          tone={tone}
          label="Storage used · ring"
          value={used}
          min={0}
          max={100}
          formatValue={(value) => value + "%"}
        />
      </Grid>
      <Slider
        label="Try a different storage level"
        min={0}
        max={100}
        value={used}
        onValueChange={setUsed}
      />
    </VStack>
  );
}
