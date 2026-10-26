import { useState } from "react";
import { Badge, HStack, Picker, Text, Toggle, Transition, VStack } from "@/ohmygui";

const effects = ["fade", "slide", "scale", "rotate", "flip", "reveal"] as const;

export default function Example() {
  const [active, setActive] = useState(true);
  const [mode, setMode] = useState<"effect" | "classes">("effect");
  const [effect, setEffect] = useState<(typeof effects)[number]>("slide");
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("up");
  const [distance, setDistance] = useState("24");
  const [message, setMessage] = useState("Ready to transition.");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Transition style" value={mode} onChange={(event) => setMode(event.currentTarget.value as typeof mode)} items={[{ value: "effect", label: "Built-in effect" }, { value: "classes", label: "Custom classes" }]} />
        {mode === "effect" && <>
          <Picker label="Effect" value={effect} onChange={(event) => setEffect(event.currentTarget.value as typeof effect)} items={effects.map((value) => ({ value, label: value }))} />
          <Picker label="Direction" value={direction} onChange={(event) => setDirection(event.currentTarget.value as typeof direction)} items={["up", "down", "left", "right"].map((value) => ({ value, label: value }))} />
          <Picker label="Travel" value={distance} onChange={(event) => setDistance(event.currentTarget.value)} items={[{ value: "12", label: "12 px" }, { value: "24", label: "24 px" }, { value: "40", label: "40 px" }]} />
        </>}
        <Toggle label="Destination active" checked={active} onChange={(event) => setActive(event.currentTarget.checked)} />
      </HStack>

      <Transition
        active={active}
        effect={effect}
        direction={direction}
        distance={Number(distance)}
        duration={360}
        easing="cubic-bezier(.2,.8,.2,1)"
        from={mode === "classes" ? "opacity-0 translate-y-3 scale-95" : undefined}
        to={mode === "classes" ? "opacity-100 translate-y-0 scale-100" : undefined}
        onEnterComplete={() => setMessage("Entrance complete.")}
        onExitComplete={() => setMessage("Exit complete.")}
      >
        <Badge variant="accent" size="lg">A softer entrance.</Badge>
      </Transition>

      <Text as="p" variant="metadata" role="status" aria-live="polite">{message}</Text>
    </VStack>
  );
}
