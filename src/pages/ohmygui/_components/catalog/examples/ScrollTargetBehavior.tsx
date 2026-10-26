import { useState } from "react";
import { Grid, Group, GroupBox, Picker, ScrollTargetBehavior, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [snap, setSnap] = useState<"mandatory" | "proximity" | "none">("mandatory");
  const [align, setAlign] = useState<"start" | "center" | "end">("start");

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Snap strength" value={snap} onChange={(event) => setSnap(event.currentTarget.value as typeof snap)} items={["none", "proximity", "mandatory"].map((value) => ({ value, label: value }))} />
        <Picker label="Target alignment" value={align} onChange={(event) => setAlign(event.currentTarget.value as typeof align)} items={["start", "center", "end"].map((value) => ({ value, label: value }))} />
      </Grid>
      <ScrollTargetBehavior snap={snap} align={align} tabIndex={0} aria-label="Project stages">
        {[
          { name: "Planned", detail: "3 projects" },
          { name: "In progress", detail: "2 projects" },
          { name: "Review", detail: "4 projects" },
          { name: "Published", detail: "12 projects" },
        ].map(({ name, detail }) => (
          <Group key={name} className="h-[120px] w-[180px]">
            <GroupBox title={name}><Text>{detail}</Text></GroupBox>
          </Group>
        ))}
      </ScrollTargetBehavior>
    </VStack>
  );
}
