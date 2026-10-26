import { useState } from "react";
import { Grid, GroupBox, HoverEffect, NavigationLink, Picker, VStack } from "@/ohmygui";

const variants = ["lift", "glow", "scale"] as const;

export default function Example() {
  const [duration, setDuration] = useState("220");

  return (
    <VStack gap="md" align="stretch">
      <Picker label="Transition duration" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "100", label: "Quick · 100 ms" }, { value: "220", label: "Default · 220 ms" }, { value: "400", label: "Relaxed · 400 ms" }]} />
      <Grid columns={{ compact: 1, regular: 3 }} gap="md">
        {variants.map((variant) => (
          <HoverEffect key={variant} variant={variant} duration={Number(duration)}>
            <GroupBox title={variant[0].toUpperCase() + variant.slice(1)}>
              <NavigationLink href="/ohmygui">
                Hover or focus to preview.
              </NavigationLink>
            </GroupBox>
          </HoverEffect>
        ))}
      </Grid>
    </VStack>
  );
}
