import { useState } from "react";
import { AspectRatio, Grid, Group, Image, Picker, Surface, Text, VStack } from "@/ohmygui";

const ratios = [
  { value: "wide", label: "16:9", ratio: "16 / 9" },
  { value: "square", label: "1:1", ratio: 1 },
  { value: "classic", label: "4:3", ratio: "4 / 3" },
] as const;

export default function Example() {
  const [ratio, setRatio] = useState<(typeof ratios)[number]["value"]>("wide");
  const [contentMode, setContentMode] = useState<"fit" | "fill">("fill");
  const selectedRatio = ratios.find((item) => item.value === ratio) ?? ratios[0];

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Aspect ratio" value={ratio} onChange={(event) => setRatio(event.currentTarget.value as typeof ratio)} items={ratios.map(({ value, label }) => ({ value, label }))} />
        <Picker label="Content mode" value={contentMode} onChange={(event) => setContentMode(event.currentTarget.value as typeof contentMode)} items={[{ value: "fill", label: "Fill · crop" }, { value: "fit", label: "Fit · contain" }]} />
      </Grid>
      <Group className="w-[360px] max-w-full">
        <Surface appearance="outlined" padding="none">
          <AspectRatio ratio={selectedRatio.ratio} contentMode={contentMode}>
            <Image src="/ohmygui/landscape.svg" alt="Illustrated green hills beneath a warm sun" width={420} height={260} />
          </AspectRatio>
        </Surface>
      </Group>
      <Text variant="metadata" color="muted">{selectedRatio.label} · {contentMode === "fill" ? "crop to frame" : "contain the full image"}</Text>
    </VStack>
  );
}
