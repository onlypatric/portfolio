import { useState } from "react";
import { Avatar, HStack, Toggle, VStack } from "@/ohmygui";

export default function Example() {
  const [showImage, setShowImage] = useState(true);

  return (
    <VStack gap="md" align="stretch">
      <Toggle label="Use image source" checked={showImage} onChange={(event) => setShowImage(event.currentTarget.checked)} />
      <HStack gap="md" align="center" wrap>
        <Avatar
          src={showImage ? "/ohmygui/landscape.svg" : undefined}
          initials="OG"
          alt="OhMyGUI landscape"
          size="lg"
          palette="sage"
          presence="online"
        />
        <Avatar
          initials="AL"
          alt="Alex Lee"
          shape="rounded"
          size={64}
          palette="auto"
          identity="alex-lee"
          presence="away"
        />
        <Avatar initials="MP" alt="Morgan Park" shape="square" />
      </HStack>
    </VStack>
  );
}
