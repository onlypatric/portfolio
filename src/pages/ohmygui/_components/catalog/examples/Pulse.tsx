import { useState } from "react";
import { Pulse } from "@/_components/common/ohmygui/behavior/Pulse";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  const [paused, setPaused] = useState(false);
  return <VStack gap="lg" align="start">
    <Button variant="outline" onClick={() => setPaused(value => !value)}>{paused ? "Resume motion" : "Pause motion"}</Button>
    <Pulse disabled={paused}><Badge variant="accent" size="lg">New messages · 3</Badge></Pulse>
  </VStack>;
}
