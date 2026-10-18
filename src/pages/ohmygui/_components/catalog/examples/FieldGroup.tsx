import { FieldGroup } from "@/_components/common/ohmygui/input/FieldGroup";
import { TextField } from "@/_components/common/ohmygui/input/TextField";

export default function Example() {
  return (
    <FieldGroup legend="Project details">
      <TextField label="Name" defaultValue="Spring garden" />
      <TextField label="Description" placeholder="Add a short summary…" />
      </FieldGroup>
  );
}
