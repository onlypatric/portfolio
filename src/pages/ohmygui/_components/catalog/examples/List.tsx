import { useState } from "react";
import { Badge, HStack, List, Picker, Text, Toggle, VStack } from "@/ohmygui";

const items = [
  { id: "one", name: "Personal studio", status: "Ready" },
  { id: "two", name: "Component garden", status: "In progress" },
  { id: "three", name: "Quiet archive", status: "Paused" },
];

export default function Example() {
  const [selection, setSelection] = useState<string | number | readonly (string | number)[]>("one");
  const [density, setDensity] = useState<"comfortable" | "compact">("compact");
  const [multiple, setMultiple] = useState(false);
  const [empty, setEmpty] = useState(false);
  const selected = Array.isArray(selection) ? selection : [selection];

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Density" value={density} onChange={(event) => setDensity(event.currentTarget.value as typeof density)} items={[{ value: "comfortable", label: "Comfortable" }, { value: "compact", label: "Compact" }]} />
        <Toggle label="Multiple selection" checked={multiple} onChange={(event) => { const enabled = event.currentTarget.checked; setMultiple(enabled); setSelection((current) => enabled ? Array.isArray(current) ? current : [current] : Array.isArray(current) ? current[0] ?? "one" : current); }} />
        <Toggle label="Show empty state" checked={empty} onChange={(event) => setEmpty(event.currentTarget.checked)} />
      </HStack>
      <List
        aria-label="Workspaces" items={empty ? [] : items} density={density}
        emptyState={<Text>No workspaces yet. Create one to get started.</Text>}
        getKey={(item) => item.id}
        render={(item) => <HStack align="center" justify="between" gap="sm" wrap><Text>{item.name}</Text><Badge tone="soft">{item.status}</Badge></HStack>}
        selection={selection}
        onSelectionChange={(key) => setSelection((current) => {
          const values = Array.isArray(current) ? current : [current];
          return multiple ? values.includes(key) ? values.filter((value) => value !== key) : [...values, key] : key;
        })}
      />
      <Text as="p" variant="metadata" role="status" aria-live="polite">
        Selected: {empty ? "none" : selected.map((key) => items.find((item) => item.id === key)?.name).filter(Boolean).join(", ") || "none"}
      </Text>
    </VStack>
  );
}
