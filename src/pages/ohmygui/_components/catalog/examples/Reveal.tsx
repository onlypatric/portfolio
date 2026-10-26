import { useState } from "react";
import { Button, Grid, GroupBox, Picker, Reveal, Text, VStack } from "@/ohmygui";

const directions = ["left", "right", "up", "down"] as const;

export default function Example() {
  const [direction, setDirection] = useState<(typeof directions)[number]>("left");
  const [duration, setDuration] = useState("650");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Reveal from" value={direction} onChange={(event) => setDirection(event.currentTarget.value as typeof direction)} items={directions.map((value) => ({ value, label: value }))} />
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "350", label: "Fast · 350 ms" }, { value: "650", label: "Default · 650 ms" }, { value: "1000", label: "Slow · 1 s" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Reveal replayKey={replay} duration={Number(duration)} direction={direction}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Reveal>
    </VStack>
  );
}
