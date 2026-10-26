import { useState } from "react";
import { Badge, Button, Float, Grid, Picker, VStack } from "@/ohmygui";

export default function Example() {
  const [paused, setPaused] = useState(false);
  const [distance, setDistance] = useState("8");

  return (
    <VStack gap="md" align="start">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Float height" value={distance} onChange={(event) => setDistance(event.currentTarget.value)} items={[{ value: "4", label: "4 px" }, { value: "8", label: "8 px" }, { value: "16", label: "16 px" }]} />
        <Button variant="outline" onClick={() => setPaused((value) => !value)}>{paused ? "Resume motion" : "Pause motion"}</Button>
      </Grid>
      <Float disabled={paused} distance={Number(distance)} duration={2200} repeat>
        <Badge variant="accent" size="lg">New messages · 3</Badge>
      </Float>
    </VStack>
  );
}
