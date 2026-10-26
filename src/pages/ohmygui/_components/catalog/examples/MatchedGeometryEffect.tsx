import { useState } from "react";
import {
  Badge,
  Button,
  HStack,
  MatchedGeometryEffect,
  Text,
  VStack,
} from "@/ohmygui";
import { flushSync } from "react-dom";

export default function Example() {
  const [right, setRight] = useState(false);
  return (
    <VStack gap="lg">
      <Button
        variant="outline"
        onClick={() => {
          const update = () => flushSync(() => setRight((value) => !value));
          if (
            document.startViewTransition &&
            !matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            document.startViewTransition(update);
          else update();
        }}
      >
        Move the tile
      </Button>
      <HStack justify={right ? "end" : "start"} align="center">
        <MatchedGeometryEffect namespace="showcase" id="moving-tile">
          <Badge variant="accent" size="lg">
            Same tile
          </Badge>
        </MatchedGeometryEffect>
      </HStack>
      <Text as="p" color="muted">
        Uses native view transitions when available; otherwise moves
        immediately.
      </Text>
    </VStack>
  );
}
