import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Toast } from "@/_components/common/ohmygui/presentation/Toast";
import { Button } from "@/_components/common/ohmygui/control/button/Button";

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <VStack gap="md">{visible ? <Toast message="Changes saved" type="success" duration={0} onDismiss={() => setVisible(false)} /> : <Button onClick={() => setVisible(true)}>Show toast</Button>}</VStack>
  );
}
