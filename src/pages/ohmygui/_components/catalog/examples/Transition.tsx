import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Transition } from "@/_components/common/ohmygui/behavior/Transition";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  const [active, setActive] = useState(true);
  return (
    <VStack gap="lg">
      <Button variant="outline" onClick={() => setActive((value) => !value)}>Toggle transition</Button>
      <Transition active={active} from="opacity-0 translate-y-2" to="opacity-100 translate-y-0">
      <Badge variant="accent" size="lg">A softer entrance.</Badge>
      </Transition>
      </VStack>
  );
}
