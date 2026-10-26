import { useState } from "react";
import { HStack, MultiDatePicker, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["2026-10-17"]);
  const [locale, setLocale] = useState("en-US");
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1);
  const [readOnly, setReadOnly] = useState(false);
  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Locale" value={locale} onChange={(event) => setLocale(event.currentTarget.value)} items={[{ value: "en-US", label: "English" }, { value: "it-IT", label: "Italiano" }]} />
        <Picker label="Week starts" value={String(weekStartsOn)} onChange={(event) => setWeekStartsOn(Number(event.currentTarget.value) as 0 | 1)} items={[{ value: "0", label: "Sunday" }, { value: "1", label: "Monday" }]} />
        <Toggle label="Read only" checked={readOnly} onChange={(event) => setReadOnly(event.currentTarget.checked)} />
      </HStack>
      <MultiDatePicker label="Studio days" name="studioDays" initialMonth="2026-10" min="2026-09-01" max="2027-02-28" locale={locale} weekStartsOn={weekStartsOn} readOnly={readOnly} selected={selected} onSelectedChange={setSelected} />
      <Text as="p" variant="metadata" role="status" aria-live="polite">{selected.length ? selected.join(" · ") : "No dates selected."}</Text>
    </VStack>
  );
}
