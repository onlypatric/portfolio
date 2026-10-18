import { useState } from "react";
import { Alert } from "@/_components/common/ohmygui/presentation/Alert";

export default function Example() {
  const [message, setMessage] = useState("Version 2.4 is live for all workspaces.");
  return (
    <Alert severity="success" title="Release published" message={message} actions={[{ label: "Dismiss", onSelect: () => setMessage("Release acknowledged.") }]} />
  );
}
