import { useState } from "react";
import { ScrollView } from "@/_components/common/ohmygui/layout/ScrollView";
import { ScrollViewReader } from "@/_components/common/ohmygui/layout/ScrollViewReader";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [target, setTarget] = useState<string>();
  return (
    <VStack gap="md">
      <Button onClick={() => setTarget(target ? undefined : "reader-note-8")}>Jump to note 8</Button>
      <ScrollView maxHeight={180}>
      <ScrollViewReader targetId={target}>{Array.from({ length: 10 }, (_, index) => <Text as="p" key={index} id={"reader-note-" + (index + 1)} style={{ padding: 16 }}>Note {index + 1}</Text>)}</ScrollViewReader>
      </ScrollView>
      </VStack>
  );
}
