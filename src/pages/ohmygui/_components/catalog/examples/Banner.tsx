import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Banner } from "@/_components/common/ohmygui/presentation/Banner";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <VStack gap="md">{visible ? <Banner title="Preview ready" dismissable onDismiss={() => setVisible(false)}>The field guide is ready for review.</Banner> : <Button variant="outline" onClick={() => setVisible(true)}>Show banner</Button>}</VStack>
  );
}
