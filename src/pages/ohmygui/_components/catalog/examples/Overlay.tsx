import { useState } from "react";
import { Badge, Button, Card, HStack, Overlay, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [align, setAlign] = useState<"start" | "center" | "end" | "stretch">("end");
  const [interactive, setInteractive] = useState(false);
  const [blur, setBlur] = useState(true);
  const [message, setMessage] = useState("Overlay is decorative and ignored by assistive technology.");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Alignment" value={align} onChange={(event) => setAlign(event.currentTarget.value as typeof align)} items={[{ value: "start", label: "Start" }, { value: "center", label: "Center" }, { value: "end", label: "End" }, { value: "stretch", label: "Stretch" }]} />
        <Toggle label="Interactive overlay" checked={interactive} onChange={(event) => setInteractive(event.currentTarget.checked)} />
        <Toggle label="Decorative blur" checked={blur} onChange={(event) => setBlur(event.currentTarget.checked)} disabled={interactive} />
      </HStack>
      <Overlay
        align={align}
        interactive={interactive}
        decorativeBlur={!interactive && blur ? "10px" : undefined}
        overlay={interactive
          ? <Button size="sm" onClick={() => setMessage("Overlay action activated.")}>Open details</Button>
          : <Badge variant="success" tone="soft">Published</Badge>}
      >
        <Card><Text as="p" variant="title">A clear status stays above the content.</Text></Card>
      </Overlay>
      <Text as="p" variant="metadata" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
