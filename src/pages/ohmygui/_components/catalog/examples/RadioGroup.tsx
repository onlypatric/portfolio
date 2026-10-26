import { useState } from "react";
import { HStack, Picker, RadioGroup, Text, Toggle, VStack } from "@/ohmygui";

type Orientation = "vertical" | "horizontal";
type StateMode = "controlled" | "uncontrolled";

export default function Example() {
  const [value, setValue] = useState("weekly");
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [stateMode, setStateMode] = useState<StateMode>("controlled");
  const [disabled, setDisabled] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Orientation" value={orientation} onChange={(event) => setOrientation(event.currentTarget.value as Orientation)} items={[{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]} />
        <Picker label="Selection state" value={stateMode} onChange={(event) => { const next = event.currentTarget.value as StateMode; setStateMode(next); if (next === "uncontrolled") setValue("weekly"); }} items={[{ value: "controlled", label: "Controlled" }, { value: "uncontrolled", label: "Uncontrolled" }]} />
        <Toggle label="Disable group" checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)} />
      </HStack>
      <RadioGroup
        key={stateMode}
        name="delivery"
        legend="Update frequency"
        helperText="Choose a required delivery schedule."
        orientation={orientation}
        required
        disabled={disabled}
        items={[
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "daily", label: "Daily — unavailable", disabled: true },
        ]}
        value={stateMode === "controlled" ? value : undefined}
        defaultValue="weekly"
        onChange={setValue}
      />
      <Text as="p" variant="metadata" role="status" aria-live="polite">Selected: {value}</Text>
    </VStack>
  );
}
