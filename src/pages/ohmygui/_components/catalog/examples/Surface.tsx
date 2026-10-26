import { useState } from "react";
import { Grid, Picker, Surface, Text, Toggle, VStack } from "@/ohmygui";

const tones = ["neutral", "accent", "success", "warning", "danger", "contrast", "paper"] as const;
const appearances = ["plain", "outlined", "soft", "elevated", "solid"] as const;

export default function Example() {
  const [tone, setTone] = useState<(typeof tones)[number]>("accent");
  const [appearance, setAppearance] = useState<(typeof appearances)[number]>("soft");
  const [padding, setPadding] = useState("md");
  const [material, setMaterial] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Semantic tone" value={tone} onChange={(event) => setTone(event.currentTarget.value as typeof tone)} items={tones.map((value) => ({ value, label: value }))} />
        <Picker label="Appearance" value={appearance} onChange={(event) => setAppearance(event.currentTarget.value as typeof appearance)} items={appearances.map((value) => ({ value, label: value }))} />
        <Picker label="Padding" value={padding} onChange={(event) => setPadding(event.currentTarget.value)} items={["sm", "md", "lg"].map((value) => ({ value, label: value }))} />
        <Toggle label="Material surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      </Grid>
      <Surface as="section" aria-label="Configurable surface example" tone={tone} appearance={appearance} padding={padding} radius="md" material={material ? { blur: "12px", opacity: 0.88 } : false}>
        <Text as="p" weight="semibold">{tone} · {appearance} · {padding} padding</Text>
        <Text as="p" color="muted">A single surface combines semantic color, treatment, spacing, and material.</Text>
      </Surface>
    </VStack>
  );
}
