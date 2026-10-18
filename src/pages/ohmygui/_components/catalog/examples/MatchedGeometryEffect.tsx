import { useState } from "react";
import { HStack } from "@/_components/common/ohmygui/layout/HStack";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { MatchedGeometryEffect } from "@/_components/common/ohmygui/behavior/MatchedGeometryEffect";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { flushSync } from "react-dom";

export default function Example() {
  const [right, setRight] = useState(false);
  return (
    <VStack gap="lg">
      <Button variant="outline" onClick={() => { const update = () => flushSync(() => setRight((value) => !value)); if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(update); else update(); }}>Move the tile</Button>
      <HStack style={{ minHeight: 100, justifyContent: right ? "flex-end" : "flex-start" }}>
      <MatchedGeometryEffect namespace="showcase" id="moving-tile">
      <Badge variant="accent" size="lg">Same tile</Badge>
      </MatchedGeometryEffect>
      </HStack>
      <Text as="p" color="muted">Uses native view transitions when available; otherwise moves immediately.</Text>
      </VStack>
  );
}
