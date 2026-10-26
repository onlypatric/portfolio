import { useState } from "react";
import { Picker, SwipeActions, Text, VStack } from "@/ohmygui";

export default function Example() {
  const [threshold, setThreshold] = useState("72");
  const [message, setMessage] = useState("");
  return (
    <VStack gap="sm" align="stretch">
      <Picker
        label="Configured threshold"
        value={threshold}
        onChange={(event) => setThreshold(event.currentTarget.value)}
        items={["48", "72", "96"].map((value) => ({ value, label: `${value} px` }))}
      />
      <SwipeActions
        threshold={Number(threshold)}
        actions={[
          { label: "Snooze", onSelect: () => setMessage("Brief snoozed.") },
          {
            label: "Archive",
            tone: "danger",
            onSelect: () => setMessage("Brief archived."),
          },
        ]}
      >
        <Text as="p">Send the revised brief before Friday.</Text>
      </SwipeActions>
      {message && (
        <Text as="p" role="status" aria-live="polite">{message}</Text>
      )}
      <Text as="p" variant="metadata" color="muted">Threshold is exposed as data; actions currently render inline without swipe recognition.</Text>
    </VStack>
  );
}
