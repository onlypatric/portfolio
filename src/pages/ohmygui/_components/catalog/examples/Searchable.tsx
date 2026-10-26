import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Badge, Grid, HStack, Picker, Searchable, Text, Toggle, VStack } from "@/ohmygui";

const components = ["Searchable", "TabView", "NavigationSplitView", "ButtonGroup", "CommandPalette"];

export default function Example() {
  const [query, setQuery] = useState("");
  const [debounce, setDebounce] = useState("250");
  const [clearable, setClearable] = useState(true);
  const [submitted, setSubmitted] = useState("");
  const results = components.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <VStack gap="md" align="stretch">
      <Searchable
        label="Search the component catalog" placeholder="Try “tab” or “toolbar”…"
        query={query} onQueryChange={setQuery} debounce={Number(debounce)} queryParam="q"
        clearable={clearable} suggestions={components}
        startContent={<MagnifyingGlassIcon aria-hidden="true" />}
        endContent={<Text as="small" color="muted">Enter to search</Text>}
        inputProps={{ autoComplete: "off", maxLength: 40 }}
        onSubmit={(event) => { event.preventDefault(); setSubmitted(query); }}
      />
      <Grid columns="auto" minColumnWidth={190} gap="sm">
        <Picker label="Debounce" value={debounce} onChange={(event) => setDebounce(event.currentTarget.value)} items={[{ value: "0", label: "None" }, { value: "250", label: "250 ms" }, { value: "500", label: "500 ms" }]} />
        <Toggle label="Show clear button" checked={clearable} onChange={(event) => setClearable(event.currentTarget.checked)} />
      </Grid>
      <VStack gap="xs" align="stretch" aria-live="polite">
        <HStack gap="sm" align="center" wrap>
          <Text as="p" variant="metadata" color="muted">{query ? `${results.length} matching components` : "Popular components"}</Text>
          {submitted && <Badge tone="outline">Submitted: {submitted}</Badge>}
        </HStack>
        {results.length ? <HStack gap="xs" wrap>{results.map((item) => <Badge key={item} tone="soft">{item}</Badge>)}</HStack> : <Text as="p" variant="metadata" color="muted">No components match that search.</Text>}
      </VStack>
    </VStack>
  );
}
