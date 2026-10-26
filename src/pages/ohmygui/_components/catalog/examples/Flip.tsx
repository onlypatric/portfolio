import { useState } from "react";
import { Button, Flip, Grid, GroupBox, Picker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [axis, setAxis] = useState<"x" | "y">("y");
  const [angle, setAngle] = useState("75");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Flip axis" value={axis} onChange={(event) => setAxis(event.currentTarget.value as typeof axis)} items={[{ value: "x", label: "Horizontal" }, { value: "y", label: "Vertical" }]} />
        <Picker label="Start angle" value={angle} onChange={(event) => setAngle(event.currentTarget.value)} items={[{ value: "45", label: "45°" }, { value: "75", label: "75°" }, { value: "120", label: "120°" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Flip replayKey={replay} duration={650} axis={axis} angle={Number(angle)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Flip>
    </VStack>
  );
}
