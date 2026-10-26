import { useState } from "react";
import { Button, Picker, Text, Toast, VStack } from "@/ohmygui";

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("Changes saved");
  const [type, setType] = useState<"danger" | "info" | "success" | "warning">("success");
  const [duration, setDuration] = useState("6000");
  const [placement, setPlacement] = useState<"inline" | "bottom-end" | "bottom-center" | "top-end">("inline");
  return (
    <VStack gap="md" align="stretch">
      <Picker label="Toast type" value={type} onChange={(event) => setType(event.currentTarget.value as typeof type)} items={["info", "success", "warning", "danger"].map((value) => ({ value, label: value }))} />
      <Picker label="Auto dismiss" value={duration} onChange={(event) => setDuration(event.currentTarget.value)} items={[{ value: "0", label: "Manual" }, { value: "3000", label: "3 seconds" }, { value: "6000", label: "6 seconds" }]} />
      <Picker label="Placement" value={placement} onChange={(event) => setPlacement(event.currentTarget.value as typeof placement)} items={[{ value: "inline", label: "Inline" }, { value: "top-end", label: "Top end" }, { value: "bottom-end", label: "Bottom end" }, { value: "bottom-center", label: "Bottom center" }]} />
      {visible ? (
        <Toast
          message={message}
          type={type}
          duration={Number(duration)}
          placement={placement}
          actionLabel="Undo"
          onAction={() => setMessage("Save undone")}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <Button onClick={() => setVisible(true)}>Show toast</Button>
      )}
      {duration === "0" && <Text as="p" variant="metadata" color="muted">Manual dismissal is enabled.</Text>}
    </VStack>
  );
}
