import { useState } from "react";
import { Button, Grid, GroupBox, Picker, Scale, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [fromScale, setFromScale] = useState("0.86");
  const [replay, setReplay] = useState(0);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Start scale" value={fromScale} onChange={(event) => setFromScale(event.currentTarget.value)} items={[{ value: "0.72", label: "72%" }, { value: "0.86", label: "86%" }, { value: "0.96", label: "96%" }]} />
        <Button variant="outline" onClick={() => setReplay((value) => value + 1)}>Replay</Button>
      </Grid>
      <Scale replayKey={replay} duration={650} fromScale={Number(fromScale)}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Scale>
    </VStack>
  );
}
