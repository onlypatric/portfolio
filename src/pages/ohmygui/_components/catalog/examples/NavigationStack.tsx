import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { NavigationStack } from "@/_components/common/ohmygui/navigation/NavigationStack";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [step, setStep] = useState(1);
  return (
    <VStack gap="md">
      <Button onClick={() => setStep((value) => value + 1)}>Next destination</Button>
      <NavigationStack as="section" title={"Destination " + step} backHref="/ohmygui" transitionKey={step}>
      <Text as="p">Field guide · section {step}</Text>
      </NavigationStack>
      </VStack>
  );
}
