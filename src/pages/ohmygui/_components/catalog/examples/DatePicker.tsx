import { DatePicker } from "@/_components/common/ohmygui/input/DatePicker";
import { Picker } from "@/_components/common/ohmygui/input/Picker";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { useState } from "react";

export default function Example() {
  const [locale, setLocale] = useState(""), [date, setDate] = useState("2026-10-17");
  return (
    <VStack gap="lg">
      <Picker label="Calendar language" value={locale} onChange={event => setLocale(event.currentTarget.value)} items={[
        { value: "", label: "Browser preference" }, { value: "en-US", label: "English (US)" }, { value: "it-IT", label: "Italiano" }, { value: "fr-FR", label: "Français" }, { value: "de-DE", label: "Deutsch" }, { value: "es-ES", label: "Español" }, { value: "ar-EG", label: "العربية" }, { value: "ja-JP", label: "日本語" },
      ]} />
      <DatePicker label="Start date" name="startDate" locale={locale || undefined} value={date} onValueChange={setDate} min="2026-01-01" max="2027-12-31" />
      <Text as="p" variant="caption" color="muted">Form value: {date || "—"}</Text>
    </VStack>
  );
}
