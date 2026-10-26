import { useState } from "react";
import { Button, Grid, GroupBox, Picker, Rotate, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [angle, setAngle] = useState("-10");
  const [duration, setDuration] = useState("650");
  const [visible, setVisible] = useState(true);
  const [replay, setReplay] = useState(0);
  const [status, setStatus] = useState("Ready to rotate");

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Start angle" value={angle} onChange={(event) => setAngle(event.currentTarget.value)} items={[{ value: "-10", label: "10°" }, { value: "-25", label: "25°" }, { value: "-45", label: "45°" }]} />
        <Picker label="Duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "350", label: "Fast · 350 ms" }, { value: "650", label: "Default · 650 ms" }, { value: "1000", label: "Slow · 1 s" }]} />
        <Toggle label="Visible" checked={visible} onChange={(event) => { setVisible(event.currentTarget.checked); setStatus(event.currentTarget.checked ? "Entering" : "Leaving"); }} />
        <Button variant="outline" disabled={!visible} onClick={() => { setStatus("Rotating"); setReplay((value) => value + 1); }}>Replay</Button>
      </Grid>
      <Rotate replayKey={replay} visible={visible} duration={Number(duration)} angle={Number(angle)} onEnterComplete={() => setStatus("Rotation complete")} onExitComplete={() => setStatus("Hidden")}>
        <GroupBox title="Table for two"><Text as="p">Thursday · 7:30 pm</Text></GroupBox>
      </Rotate>
      <Text as="p" role="status" aria-live="polite">{status}</Text>
    </VStack>
  );
}
