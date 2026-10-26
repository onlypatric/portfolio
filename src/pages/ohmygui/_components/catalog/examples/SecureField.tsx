import { useState } from "react";
import { Button, Form, HStack, Picker, SecureField, Text, VStack } from "@/ohmygui";

const initialPassword = "field-notes-2026";
const modes = ["editable", "readOnly", "disabled"] as const;

export default function Example() {
  const [password, setPassword] = useState(initialPassword);
  const [mode, setMode] = useState<(typeof modes)[number]>("editable");
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState("Demo value only · no authentication");

  return (
    <VStack gap="sm" align="stretch">
      <Picker label="Field state" value={mode} onChange={(event) => setMode(event.currentTarget.value as typeof mode)} items={modes.map((value) => ({ value, label: value === "readOnly" ? "Read only" : value[0].toUpperCase() + value.slice(1) }))} />
      <Form
        onSubmit={(event) => { event.preventDefault(); setMessage("Password accepted for this form demo."); }}
        onReset={() => { setPassword(initialPassword); setTouched(false); setMessage("Demo value restored."); }}
      >
        <VStack gap="sm" align="stretch">
          <SecureField
            label="Account password"
            name="password"
            autoComplete="new-password"
            required
            minLength={12}
            revealable
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            onBlur={() => setTouched(true)}
            readOnly={mode === "readOnly"}
            disabled={mode === "disabled"}
            error={touched && password.length < 12 ? "Use at least 12 characters." : undefined}
            helperText="12 characters minimum · use Show to reveal"
          />
          <HStack gap="sm" wrap>
            <Button type="submit" disabled={mode === "disabled"}>Submit</Button>
            <Button type="reset" variant="outline">Reset</Button>
          </HStack>
        </VStack>
      </Form>
      <Text as="p" variant="metadata" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
