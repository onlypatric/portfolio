import { useState } from "react";
import { Card, Group, HStack, Picker, ScrollView, Text, VStack } from "@/ohmygui";

const notes = ["09:00 · Water seedlings", "09:30 · Review cover proof", "10:15 · Call the printer", "11:00 · Update plant index", "13:30 · Pack field kits", "15:00 · Share the preview"];
const projects = ["Seed catalog", "Garden journal", "Spring plan", "Field guide"];

export default function Example() {
  const [snap, setSnap] = useState<"none" | "proximity" | "mandatory">("proximity");
  return (
    <VStack gap="md" align="stretch">
      <Picker label="Horizontal snap" value={snap} onChange={(event) => setSnap(event.currentTarget.value as typeof snap)} items={[{ value: "none", label: "Off" }, { value: "proximity", label: "Proximity" }, { value: "mandatory", label: "Mandatory" }]} />
      <HStack gap="md" align="start" wrap>
        <VStack gap="xs" align="stretch">
          <Text variant="metadata" color="muted">Vertical notes</Text>
          <ScrollView axis="vertical" overflow="auto" maxHeight={180} aria-label="Scrollable notes">
            <VStack gap="md">{notes.map((item) => <Text key={item} as="p">{item}</Text>)}</VStack>
          </ScrollView>
        </VStack>
        <VStack gap="xs" align="stretch">
          <Text variant="metadata" color="muted">Horizontal projects</Text>
          <Group className="w-[320px] max-w-full">
            <ScrollView axis="horizontal" overflow="auto" maxWidth="100%" snap={snap === "none" ? false : snap} aria-label="Scrollable projects">
              <HStack gap="sm">{projects.map((project) => <Group key={project} className={`w-[180px] shrink-0 ${snap === "none" ? "" : "snap-start"}`}><Card><Text weight="semibold">{project}</Text></Card></Group>)}</HStack>
            </ScrollView>
          </Group>
        </VStack>
      </HStack>
    </VStack>
  );
}
