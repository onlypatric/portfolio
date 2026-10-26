import { Button, MaterialSurface, Picker, Surface, Text, VStack } from "@/ohmygui";
import { useState } from "react";
export default function Example() {
  const [opaque, setOpaque] = useState(false);
  const [variant, setVariant] = useState<"light" | "dark" | "regular">("light");
  return (
    <Surface tone="accent" padding="lg">
      <MaterialSurface
        material={opaque ? false : { blur: "16px", opacity: 0.7 }}
        variant={variant}
        padding="lg"
        radius="lg"
      >
        <VStack gap="md" align="stretch">
          <Text as="h3" variant="title">
            A little depth.
          </Text>
          <Text as="p">
            A material surface with shared padding and radius options.
          </Text>
          <Picker label="Tint variant" value={variant} onChange={(event) => setVariant(event.currentTarget.value as typeof variant)} items={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "regular", label: "Regular" }]} />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpaque((value) => !value)}
          >
            {opaque ? "Enable material" : "Use opaque surface"}
          </Button>
        </VStack>
      </MaterialSurface>
    </Surface>
  );
}
