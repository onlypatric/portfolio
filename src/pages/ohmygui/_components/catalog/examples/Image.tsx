import { useState } from "react";
import { HStack, Image, Picker, Surface, Text, Toggle, VStack } from "@/ohmygui";

const fits = ["cover", "contain", "fill", "none", "scale-down"] as const;

export default function Example() {
  const [fit, setFit] = useState<(typeof fits)[number]>("cover");
  const [loading, setLoading] = useState<"lazy" | "eager">("lazy");
  const [decorative, setDecorative] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Object fit" value={fit} onChange={(event) => setFit(event.currentTarget.value as typeof fit)} items={fits.map((value) => ({ value, label: value }))} />
        <Picker label="Loading" value={loading} onChange={(event) => setLoading(event.currentTarget.value as typeof loading)} items={[{ value: "lazy", label: "Lazy" }, { value: "eager", label: "Eager" }]} />
        <Toggle label="Decorative image" checked={decorative} onChange={(event) => setDecorative(event.currentTarget.checked)} />
      </HStack>
      <Surface appearance="outlined" padding="none">
        <Image
          src="/ohmygui/landscape.svg"
          alt={decorative ? "" : "Illustrated green hills beneath a warm sun"}
          decorativeBlur={decorative ? "12px" : undefined}
          fit={fit}
          loading={loading}
          width={420}
          height={260}
        />
      </Surface>
      <Text as="p" variant="metadata" color="muted">
        {decorative ? "Empty alt text marks this as decorative." : "Descriptive alt text keeps the illustration accessible."}
      </Text>
    </VStack>
  );
}
