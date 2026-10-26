import { useState } from "react";
import { Button, CodeText, Text, VStack } from "@/ohmygui";

const source = `import { Badge } from "@/ohmygui";\n\n<Badge variant="success">Published</Badge>`;

export default function Example() {
  const [wrap, setWrap] = useState(false);
  const [status, setStatus] = useState("");
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setStatus("Copied."); }
    catch { setStatus("Clipboard unavailable."); }
  };

  return (
    <VStack gap="md" align="stretch">
      <CodeText mode="snippet" copyButton={<Button size="sm" variant="outline" onClick={() => void copy("npm run dev")}>Copy</Button>}>
        npm run dev
      </CodeText>
      <CodeText mode="full" filename="Badge.tsx" language="tsx" wrap={wrap} actions={<>
        <Button size="sm" variant="ghost" aria-pressed={wrap} onClick={() => setWrap((value) => !value)}>Wrap</Button>
        <Button size="sm" variant="outline" onClick={() => void copy(source)}>Copy</Button>
      </>}>
        {source}
      </CodeText>
      <Text as="p" role="status" variant="caption">{status || "Choose wrapping or copy an example."}</Text>
    </VStack>
  );
}
