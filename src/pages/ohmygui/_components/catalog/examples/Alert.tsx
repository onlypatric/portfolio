import { useState } from "react";
import { Alert, Button, Picker, VStack } from "@/ohmygui";

type Severity = "danger" | "info" | "success" | "warning";

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [severity, setSeverity] = useState<Severity>("success");

  return (
    <VStack gap="md" align="stretch">
      <Picker label="Severity" value={severity} onChange={(event) => setSeverity(event.currentTarget.value as Severity)} items={[{ value: "info", label: "Info" }, { value: "success", label: "Success" }, { value: "warning", label: "Warning" }, { value: "danger", label: "Danger" }]} />
      {visible ? (
        <Alert
          severity={severity}
          title={severity === "success" ? "Release published" : "Release update"}
          message="Version 2.4 is live for all workspaces."
          actions={[{ label: "Acknowledge", onSelect: () => setVisible(false) }]}
        />
      ) : (
        <Button variant="outline" onClick={() => setVisible(true)}>Show alert again</Button>
      )}
    </VStack>
  );
}
