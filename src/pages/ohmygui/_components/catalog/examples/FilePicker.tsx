import { useState } from "react";
import { Button, FilePicker, Form, HStack, Picker, Text, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [count, setCount] = useState(0);
  const [kind, setKind] = useState<"image" | "document">("image");
  const [multiple, setMultiple] = useState(true);
  return (
    <Form onReset={() => setCount(0)}>
      <VStack gap="md" align="stretch">
        <HStack gap="md" wrap>
          <Picker label="File type" value={kind} onChange={(event) => setKind(event.currentTarget.value as typeof kind)} items={[{ value: "image", label: "Images" }, { value: "document", label: "PDF documents" }]} />
          <Toggle label="Allow multiple files" checked={multiple} onChange={(event) => setMultiple(event.currentTarget.checked)} />
        </HStack>
        <FilePicker label={kind === "image" ? "Garden photos" : "Project brief"} name="attachments" multiple={multiple} accept={kind === "image" ? "image/*" : "application/pdf"} maxSize={5 * 1024 * 1024} helperText="5 MB max per file · selection stays local." onFilesChange={(files) => setCount(files.length)} />
        <HStack justify="between" align="center" wrap>
          <Text as="p" role="status">{count} images selected · nothing uploaded.</Text>
          <Button type="reset" variant="outline">Clear selection</Button>
        </HStack>
      </VStack>
    </Form>
  );
}
