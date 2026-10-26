import { useState } from "react";
import { Card, Grid, HStack, Picker, Text, VStack } from "@/ohmygui";

type GridMode = "auto" | "fixed" | "responsive";

const projects = [
  { title: "Field guide", detail: "Draft · 8 pages" },
  { title: "Planting calendar", detail: "Published · 12 pages" },
  { title: "Garden journal", detail: "Updated today" },
];

export default function Example() {
  const [mode, setMode] = useState<GridMode>("auto");
  const [gap, setGap] = useState<"sm" | "md" | "lg">("md");
  const columns = mode === "auto" ? "auto" : mode === "fixed" ? 2 : { compact: 1, regular: 2, wide: 3 };

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Column strategy" value={mode} onChange={(event) => setMode(event.currentTarget.value as GridMode)} items={[{ value: "auto", label: "Auto-fit by minimum width" }, { value: "fixed", label: "Fixed · 2 columns" }, { value: "responsive", label: "Breakpoint columns" }]} />
        <Picker label="Gap" value={gap} onChange={(event) => setGap(event.currentTarget.value as typeof gap)} items={[{ value: "sm", label: "Small" }, { value: "md", label: "Medium" }, { value: "lg", label: "Large" }]} />
      </HStack>
      <Grid columns={columns} minColumnWidth={mode === "auto" ? 180 : undefined} gap={gap}>
        {projects.map(({ title, detail }) => (
          <Card key={title} header={<Text as="h3" variant="title">{title}</Text>}>
            <Text variant="metadata" color="muted">{detail}</Text>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}
