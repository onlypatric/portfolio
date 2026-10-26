import { useState } from "react";
import { Button, Form, HStack, Picker, Text, TextEditor, VStack } from "@/ohmygui";

const initialBrief = "Launch the field guide in early May. Finalize the cover, confirm print quantities, and prepare the bookstore preview.";
const rowOptions = ["3", "5", "8"].map((value) => ({ value, label: `${value} rows` }));
const editorModes = ["editable", "readOnly", "disabled"] as const;

export default function Example() {
  const [value, setValue] = useState(initialBrief);
  const [rows, setRows] = useState("5");
  const [mode, setMode] = useState<"editable" | "readOnly" | "disabled">("editable");
  const [message, setMessage] = useState("Changes stay local to this example.");

  return (
    <VStack gap="sm" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Visible rows" value={rows} onChange={(event) => setRows(event.currentTarget.value)} items={rowOptions} />
        <Picker label="Editor state" value={mode} onChange={(event) => setMode(event.currentTarget.value as typeof mode)} items={editorModes.map((value) => ({ value, label: value === "readOnly" ? "Read only" : value[0].toUpperCase() + value.slice(1) }))} />
      </HStack>
      <Form onSubmit={(event) => { event.preventDefault(); setMessage("Brief saved for this session."); }} onReset={() => { setValue(initialBrief); setMessage("Draft restored."); }}>
        <VStack gap="sm" align="stretch">
          <TextEditor label="Project brief" name="brief" rows={Number(rows)} minLength={30} maxLength={500} required helperText={`${value.length}/500 characters · minimum 30`} value={value} onChange={(event) => setValue(event.currentTarget.value)} readOnly={mode === "readOnly"} disabled={mode === "disabled"} />
          <HStack gap="sm" wrap><Button type="submit" disabled={mode === "disabled"}>Save draft</Button><Button type="reset" variant="outline">Reset</Button></HStack>
        </VStack>
      </Form>
      <Text as="p" variant="metadata" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
