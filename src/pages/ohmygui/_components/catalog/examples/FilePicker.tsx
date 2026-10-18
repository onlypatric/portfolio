import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { FilePicker } from "@/_components/common/ohmygui/input/FilePicker";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="md">
      <FilePicker label="Garden photos" name="images" multiple accept="image/*" maxSize={5 * 1024 * 1024} helperText="5 MB max per image · invalid files clear." onFilesChange={(files) => setCount(files.length)} />
      <Text as="p" role="status">{count} images selected · nothing uploaded.</Text>
      </VStack>
  );
}
