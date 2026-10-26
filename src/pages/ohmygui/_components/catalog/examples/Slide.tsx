import { useState } from "react";
import { Button, Grid, GroupBox, Picker, Slide, Text, VStack } from "@/ohmygui";

const directions = ["start", "end", "up", "down"] as const;

export default function Example() {
  const [direction, setDirection] = useState<(typeof directions)[number]>("start");
  const [distance, setDistance] = useState("28");
  const [duration, setDuration] = useState("650");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Slide from" value={direction} onChange={(event) => setDirection(event.currentTarget.value as typeof direction)} items={directions.map((value) => ({ value, label: value }))} />
        <Picker label="Travel distance" value={distance} onChange={(event) => setDistance(event.currentTarget.value)} items={[{ value: "12", label: "12 px" }, { value: "28", label: "28 px" }, { value: "48", label: "48 px" }]} />
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "350", label: "Fast · 350 ms" }, { value: "650", label: "Default · 650 ms" }, { value: "1000", label: "Slow · 1 s" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Slide replayKey={replay} duration={Number(duration)} direction={direction} distance={Number(distance)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Slide>
    </VStack>
  );
}
