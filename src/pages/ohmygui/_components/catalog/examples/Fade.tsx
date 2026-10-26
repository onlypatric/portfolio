import { useState } from "react";
import { Button, Fade, Grid, GroupBox, Picker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [duration, setDuration] = useState("650");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "300", label: "Quick · 300 ms" }, { value: "650", label: "Default · 650 ms" }, { value: "1000", label: "Slow · 1 s" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Fade replayKey={replay} duration={Number(duration)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Fade>
    </VStack>
  );
}
