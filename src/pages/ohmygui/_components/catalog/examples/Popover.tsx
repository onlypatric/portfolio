import { useState } from "react";
import { HStack, Picker, Popover, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"start" | "end">("end");
  const [material, setMaterial] = useState(true);

  return (
    <VStack align="stretch" gap="sm">
      <HStack gap="md" wrap>
        <Picker label="Placement" value={placement} onChange={(event) => setPlacement(event.currentTarget.value as typeof placement)} items={[{ value: "start", label: "Start" }, { value: "end", label: "End" }]} />
        <Toggle label="Material surface" checked={material} onChange={(event) => setMaterial(event.currentTarget.checked)} />
      </HStack>
      <Popover
        open={open}
        onOpenChange={setOpen}
        material={material ? { blur: "18px", opacity: 0.9 } : false}
        placement={placement}
        triggerAppearance="plain"
        trigger="Publication details"
        title="Spring field guide"
      >
        <Text as="p">Updated today · 24 pages</Text>
      </Popover>
      <Text variant="metadata" color="muted" role="status">
        Details {open ? "open" : "closed"}
      </Text>
    </VStack>
  );
}
