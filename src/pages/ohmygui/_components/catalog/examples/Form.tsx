import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Form } from "@/_components/common/ohmygui/input/Form";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Text } from "@/_components/common/ohmygui/content/Text";

export default function Example() {
  const [message, setMessage] = useState("No submission yet.");
  return (
    <Form onReset={() => setMessage("No submission yet.")} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); setMessage("Hello, " + String(data.get("name")) + "!"); }}>
      <TextField label="Your name" name="name" required defaultValue="Alex" />
      <Button type="submit">Say hello</Button>
      <Button type="reset" variant="ghost">Reset form</Button>
      <Text as="p" role="status">{message}</Text>
      </Form>
  );
}
