import { useState } from "react";
import { Button, ControlGroup, HStack, Link, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [message, setMessage] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [compact, setCompact] = useState(true);
  const [disabled, setDisabled] = useState(false);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Orientation" value={orientation} onChange={(event) => setOrientation(event.currentTarget.value as typeof orientation)} items={[{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]} />
        <Toggle label="Compact spacing" checked={compact} onChange={(event) => setCompact(event.currentTarget.checked)} />
        <Toggle label="Disable controls" checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)} />
      </HStack>
      <ControlGroup label="Field guide actions" orientation={orientation} compact={compact} disabled={disabled}>
        <Button variant="outline" onClick={() => setMessage("Copy created: Field guide (1).")}>Duplicate</Button>
        <Button variant="outline" onClick={() => setMessage("Field guide archived.")}>Archive</Button>
        <Link href="/ohmygui">About this library</Link>
      </ControlGroup>
      <Text as="p" variant="metadata" role="status" aria-live="polite">{message || "Disable the group to compare buttons and its still-active link."}</Text>
    </VStack>
  );
}
