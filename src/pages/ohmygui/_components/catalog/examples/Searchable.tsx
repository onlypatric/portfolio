import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Searchable } from "@/_components/common/ohmygui/navigation/Searchable";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [query, setQuery] = useState("");
  return (
    <VStack gap="md">
      <Searchable label="Find a component" startContent={<Text aria-hidden="true">⌕</Text>} endContent={<Text as="small" color="muted">Enter ↵</Text>} suggestions={["Sidebar", "TabView", "Toolbar"]} onQueryChange={setQuery} onSubmit={(event) => event.preventDefault()} />
      {query && <Text as="p" role="status">Searching: {query}</Text>}
      </VStack>
  );
}
