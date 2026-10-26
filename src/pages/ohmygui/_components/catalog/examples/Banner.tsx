import { useState } from "react";
import { Banner, Button, Grid, Picker, Toggle, VStack } from "@/ohmygui";

const variants = ["info", "success", "warning", "danger"] as const;

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [variant, setVariant] = useState<(typeof variants)[number]>("warning");
  const [material, setMaterial] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <Grid columns="auto" minColumnWidth={180} gap="sm">
        <Picker label="Severity" value={variant} onChange={(event) => setVariant(event.currentTarget.value as typeof variant)} items={variants.map((value) => ({ value, label: value }))} />
        <Toggle label="Material surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      </Grid>
      {visible ? (
        <Banner title="Review before publishing" variant={variant} material={material ? { blur: "12px", opacity: 0.92 } : false} dismissable onDismiss={() => setVisible(false)}>
          The field guide is ready for review.
        </Banner>
      ) : <Button variant="outline" onClick={() => setVisible(true)}>Show banner</Button>}
    </VStack>
  );
}
