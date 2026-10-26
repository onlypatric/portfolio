import { useState } from "react";
import { Button, HStack, NavigationStack, Picker, Text, VStack } from "@/ohmygui";

const destinations = ["Overview", "Components", "Search", "Navigation"];

export default function Example() {
  const [step, setStep] = useState(1);
  const [element, setElement] = useState<"main" | "section">("section");

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="sm" align="center" wrap>
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Previous</Button>
        <Button disabled={step === destinations.length - 1} onClick={() => setStep((value) => Math.min(destinations.length - 1, value + 1))}>Next destination</Button>
        <Picker label="Root element" value={element} onChange={(event) => setElement(event.currentTarget.value as typeof element)} items={[{ value: "section", label: "Section" }, { value: "main", label: "Main" }]} />
      </HStack>

      <NavigationStack
        as={element}
        title={destinations[step]}
        backHref="/ohmygui"
        backLabel="Component catalog"
        breadcrumbs={[
          { label: "Home", href: "/ohmygui" },
          { label: "Examples", href: "/ohmygui/examples" },
          { label: "Navigation stack" },
        ]}
        transitionKey={step}
      >
        <VStack gap="sm" align="start">
          <Text as="p">Changing destinations updates the title and remounts this keyed panel.</Text>
          <Text as="p" variant="metadata" color="muted">Destination {step + 1} of {destinations.length}</Text>
        </VStack>
      </NavigationStack>
    </VStack>
  );
}
