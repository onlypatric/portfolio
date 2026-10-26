import { useState } from "react";
import { Badge, Button, Grid, Picker, Pulse, VStack } from "@/ohmygui";

export default function Example() {
  const [paused, setPaused] = useState(false);
  const [scale, setScale] = useState("1.08");

  return (
    <VStack gap="md" align="start">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Pulse scale" value={scale} onChange={(event) => setScale(event.currentTarget.value)} items={[{ value: "1.04", label: "Subtle · 1.04×" }, { value: "1.08", label: "Medium · 1.08×" }, { value: "1.16", label: "Strong · 1.16×" }]} />
        <Button variant="outline" onClick={() => setPaused((value) => !value)}>{paused ? "Resume motion" : "Pause motion"}</Button>
      </Grid>
      <Pulse disabled={paused} scale={Number(scale)} duration={1400} repeat>
        <Badge variant="accent" size="lg">New messages · 3</Badge>
      </Pulse>
    </VStack>
  );
}
