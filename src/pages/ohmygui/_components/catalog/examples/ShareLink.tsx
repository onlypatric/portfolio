import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { ShareLink } from "@/_components/common/ohmygui/input/ShareLink";

export default function Example() {
  return (
    <VStack gap="md" align="start">
      <ShareLink title="OhMyGUI components" text="Browse the component library." url="/ohmygui">Share the library</ShareLink>
      </VStack>
  );
}
