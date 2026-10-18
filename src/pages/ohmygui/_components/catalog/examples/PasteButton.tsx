import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { PasteButton } from "@/_components/common/ohmygui/input/PasteButton";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState("text");
  return (
    <VStack gap="md">
      <PasteButton onPasteEvent={(value, kind) => { setText(value); setFormat(kind); }}>Paste text from clipboard</PasteButton>
      <PasteButton variant="outline" formats={["html", "text"]} onPasteEvent={(value, kind) => { setText(value); setFormat(kind); }}>Paste HTML source or text</PasteButton>
      <Text as="p" role="status">{text || "Clipboard access requires browser permission. Nothing is sent anywhere."}</Text>
      <Text as="p" color="muted">Format: {format}. HTML is displayed as source text, never executed.</Text>
      </VStack>
  );
}
