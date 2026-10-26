import { useState } from "react";
import { Background, HStack, Padding, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [source, setSource] = useState<"image" | "fill">("image");
  const [blur, setBlur] = useState(true);
  const [clip, setClip] = useState<"border-box" | "padding-box" | "content-box">("border-box");
  const gradient = "radial-gradient(circle at 15% 10%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 55%), linear-gradient(120deg, var(--surface), var(--ui-selection))";

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Background source" value={source} onChange={(event) => setSource(event.currentTarget.value as typeof source)} items={[{ value: "image", label: "Image layer" }, { value: "fill", label: "Gradient fill" }]} />
        <Picker label="Clip area" value={clip} onChange={(event) => setClip(event.currentTarget.value as typeof clip)} items={[{ value: "border-box", label: "Border box" }, { value: "padding-box", label: "Padding box" }, { value: "content-box", label: "Content box" }]} />
        <Toggle label="Blur decorative layer" checked={blur} onChange={(event) => setBlur(event.currentTarget.checked)} />
      </HStack>

      <Background
        as="section"
        aria-label="Background preview"
        image={source === "image" ? gradient : undefined}
        fill={source === "fill" ? gradient : undefined}
        clip={clip}
        decorativeBlur={blur ? "16px" : undefined}
      >
        <Padding padding="xl">
          <VStack gap="sm" align="start">
            <Text as="h3" variant="title">A softer surface.</Text>
            <Text as="p" color="muted">The decorative layer stays behind readable content.</Text>
          </VStack>
        </Padding>
      </Background>
    </VStack>
  );
}
