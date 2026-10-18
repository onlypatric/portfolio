import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { CodeText } from "@/_components/common/ohmygui/content/CodeText";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [status, setStatus] = useState("");
  const [wrap, setWrap] = useState(false);
  const source = `import { Badge } from "@/_components/common/ohmygui/content/Badge";

export function Welcome() {
  return <Badge tone="soft">Small pieces. Big possibilities.</Badge>;
}`;
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setStatus("Copied."); }
    catch { setStatus("Clipboard unavailable. Select and copy the code."); }
  };
  return (
    <VStack gap="md">
      <Text as="p">Style with <CodeText mode="snippet">className</CodeText>. Copy actions are caller supplied.</Text>
      <CodeText mode="snippet" copyButton={<Button size="sm" iconOnly aria-label="Copy command" onClick={() => void copy("npm run dev")}>⧉</Button>}>npm run dev</CodeText>
      <CodeText mode="full" filename="Welcome.tsx" language="tsx" wrap={wrap} actions={<>
        <Button size="sm" variant="ghost" aria-pressed={wrap} onClick={() => setWrap(value => !value)}>Wrap lines</Button>
        <Button size="sm" variant="outline" onClick={() => void copy(source)}>Copy</Button>
      </>}>{source}</CodeText>
      <CodeText mode="full">{"const minimal = true;\n// No header when no metadata or actions are supplied."}</CodeText>
      <Text as="p" role="status">{status}</Text>
      </VStack>
  );
}
