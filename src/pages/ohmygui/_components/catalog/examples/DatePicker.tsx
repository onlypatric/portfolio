import { useState } from "react";
import { DatePicker, Picker, Text, VStack } from "@/ohmygui";

type PickerMode = "date" | "time" | "datetime-local";

export default function Example() {
  const [locale, setLocale] = useState("it-IT");
  const [mode, setMode] = useState<PickerMode>("date");
  const [values, setValues] = useState<Record<PickerMode, string>>({
    date: "2026-10-19",
    time: "09:30",
    "datetime-local": "2026-10-19T09:30",
  });
  return (
    <VStack gap="md" align="start">
      <Picker
        label="Input mode"
        value={mode}
        onChange={(event) => setMode(event.target.value as PickerMode)}
        items={[
          { value: "date", label: "Date · custom calendar" },
          { value: "time", label: "Time · native input" },
          { value: "datetime-local", label: "Date and time · native input" },
        ]}
      />
      {mode === "date" && (
        <Picker
          label="Calendar language"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          items={[
            { value: "en-US", label: "English" },
            { value: "it-IT", label: "Italiano" },
          ]}
        />
      )}
      <DatePicker
        label={mode === "date" ? "Project start" : mode === "time" ? "Meeting time" : "Project start date and time"}
        name="startDate"
        mode={mode}
        locale={locale}
        value={values[mode]}
        onValueChange={(value) => setValues((current) => ({ ...current, [mode]: value }))}
        min={mode === "date" ? "2026-01-01" : undefined}
        max={mode === "date" ? "2027-12-31" : undefined}
      />
      <Text variant="metadata" color="muted">
        Form value · {values[mode] || "No value selected"}
      </Text>
    </VStack>
  );
}
