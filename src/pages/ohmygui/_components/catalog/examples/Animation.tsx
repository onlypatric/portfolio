import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Animation } from "@/_components/common/ohmygui/behavior/Animation";
import { GroupBox } from "@/_components/common/ohmygui/collection/GroupBox";
import { TextField } from "@/_components/common/ohmygui/input/TextField";

export default function Example() {
  const [visible, setVisible] = useState(true);
  const [draft, setDraft] = useState("Ship the spring collection");
  return (
    <VStack gap="lg">
      <Button variant="outline" onClick={() => setVisible((value) => !value)}>Toggle animated content</Button>
      <Animation visible={visible} exit="scale" motionToken="gentle">
      <GroupBox title="Campaign draft">
      <TextField label="Headline" value={draft} onChange={event => setDraft(event.target.value)} />
      </GroupBox>
      </Animation>
      </VStack>
  );
}
