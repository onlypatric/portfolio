import { FilePicker, ShareLink, VStack } from "@/ohmygui";
import { useState } from "react";

export default function Example() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <VStack gap="md" align="stretch">
      <FilePicker label="Optional files" name="shareFiles" multiple onFilesChange={setFiles} helperText="Selected files stay in this browser until you choose Share." />
      <ShareLink
        title="OhMyGUI components"
        text="Browse the component library."
        url="/ohmygui"
      >
        Share library{files.length ? ` and ${files.length} file${files.length === 1 ? "" : "s"}` : ""}
      </ShareLink>
    </VStack>
  );
}
