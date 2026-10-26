import { useState } from "react";
import { Bounce, Button, Grid, GroupBox, Picker, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [distance, setDistance] = useState("16");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Bounce distance" value={distance} onChange={(event) => setDistance(event.currentTarget.value)} items={[{ value: "8", label: "8 px" }, { value: "16", label: "16 px" }, { value: "28", label: "28 px" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Bounce replayKey={replay} duration={650} distance={Number(distance)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Bounce>
    </VStack>
  );
}
