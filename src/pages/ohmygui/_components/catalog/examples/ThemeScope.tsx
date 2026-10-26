import { useState } from "react";
import { Badge, Card, ColorPicker, Grid, HStack, Picker, ThemeScope, VStack, type ThemeMode, type ThemePreset } from "@/ohmygui";

const presets: { value: ThemePreset; label: string }[] = ["modern", "ember", "orchid", "studio", "monochrome"].map((value) => ({ value: value as ThemePreset, label: value[0].toUpperCase() + value.slice(1) }));
const modes = [{ value: "inherit", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }];

export default function Example() {
  const [preset, setPreset] = useState<ThemePreset>("modern");
  const [mode, setMode] = useState<ThemeMode>("inherit");
  const [accent, setAccent] = useState("#3865d6");

  return (
    <ThemeScope preset={preset} mode={mode} density="compact" tokens={{ accent }}>
      <VStack gap="md" align="stretch">
        <Grid columns="auto" minColumnWidth={220} gap="sm">
          <Picker label="Preset" value={preset} onChange={(event) => setPreset(event.currentTarget.value as ThemePreset)} items={presets} />
          <Picker label="Color mode" value={mode} onChange={(event) => setMode(event.currentTarget.value as ThemeMode)} items={modes} />
          <ColorPicker label="Accent token" value={accent} onChange={(event) => setAccent(event.currentTarget.value)} />
        </Grid>
        <Card header="Scoped result">
          <HStack gap="sm" wrap>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success" tone="soft">Success</Badge>
            <Badge variant="danger" tone="soft">Danger</Badge>
            <Badge variant="warning" tone="soft">Warning</Badge>
          </HStack>
        </Card>
      </VStack>
    </ThemeScope>
  );
}
