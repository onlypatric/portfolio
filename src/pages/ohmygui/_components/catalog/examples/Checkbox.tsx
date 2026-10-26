import { useState } from "react";
import { Button, Checkbox, Form, HStack, Text, VStack } from "@/ohmygui";

const resources = ["Vehicles", "Chargers", "Storage"];

export default function Example() {
  const [selected, setSelected] = useState(["Vehicles", "Chargers"]);
  const allSelected = selected.length === resources.length;
  const mixed = selected.length > 0 && !allSelected;

  function toggleResource(resource: string) {
    setSelected((current) => current.includes(resource) ? current.filter((item) => item !== resource) : [...current, resource]);
  }

  return (
    <Form onReset={() => setSelected([])}>
      <VStack gap="sm" align="start">
        <HStack as="label" gap="sm" align="center">
          <Checkbox checked={allSelected} indeterminate={mixed} onChange={() => setSelected(allSelected ? [] : resources)} />
          Select all resources
        </HStack>
        {resources.map((resource) => (
          <HStack key={resource} as="label" gap="sm" align="center">
            <Checkbox name="resources" value={resource} checked={selected.includes(resource)} onChange={() => toggleResource(resource)} />
            {resource}
          </HStack>
        ))}
        <HStack gap="md" align="center">
          <Button type="reset" variant="outline" size="sm">Clear selection</Button>
          <Text as="p" role="status" aria-live="polite">
            {selected.length} of {resources.length} selected
          </Text>
        </HStack>
      </VStack>
    </Form>
  );
}
