import { useState } from "react";
import { Button, Grid, GroupBox, Picker, Shake, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [distance, setDistance] = useState("8");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Shake distance" value={distance} onChange={(event) => setDistance(event.currentTarget.value)} items={[{ value: "4", label: "Subtle · 4 px" }, { value: "8", label: "Default · 8 px" }, { value: "16", label: "Strong · 16 px" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Shake replayKey={replay} duration={450} distance={Number(distance)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Shake>
    </VStack>
  );
}
