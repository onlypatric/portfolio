import { useState } from "react";
import { Button, Combobox, Form, HStack, Picker, Text, Toggle, VStack } from "@/ohmygui";

type Autocomplete = "none" | "list" | "both";

export default function Example() {
  const [value, setValue] = useState("");
  const [autocomplete, setAutocomplete] = useState<Autocomplete>("list");
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Autocomplete" value={autocomplete} onChange={(event) => setAutocomplete(event.currentTarget.value as Autocomplete)} items={[{ value: "none", label: "None · show all" }, { value: "list", label: "Filter list" }, { value: "both", label: "Inline completion" }]} />
        <Toggle label="Read only" checked={readOnly} onChange={(event) => setReadOnly(event.currentTarget.checked)} />
        <Toggle label="Disabled" checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)} />
      </HStack>
      <Form onSubmit={(event) => event.preventDefault()} onReset={() => setValue("")}>
        <VStack gap="sm" align="stretch">
          <Combobox
            label="Workspace"
            name="workspace"
            helperText="Type to filter · arrows move · Enter selects · Escape closes"
            placeholder="Find a workspace…"
            options={[
              { value: "studio", label: "Personal studio" },
              { value: "library", label: "Component library" },
              { value: "garden", label: "UI garden" },
              { value: "archive", label: "Quiet archive · unavailable", disabled: true },
            ]}
            autocomplete={autocomplete}
            value={value}
            onValueChange={setValue}
            readOnly={readOnly}
            disabled={disabled}
          />
          <HStack gap="sm" wrap>
            <Button type="reset" variant="outline">Reset</Button>
            <Text as="p" role="status" aria-live="polite">Value: {value || "Nothing selected"}</Text>
          </HStack>
        </VStack>
      </Form>
    </VStack>
  );
}
