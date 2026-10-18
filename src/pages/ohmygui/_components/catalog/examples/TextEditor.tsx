import { TextEditor } from "@/_components/common/ohmygui/input/TextEditor";

export default function Example() {
  return (
    <TextEditor label="Project brief" name="brief" rows={5} maxLength={500} helperText="500 characters max." defaultValue="Launch the field guide in early May. Finalize the cover, confirm print quantities, and prepare the bookstore preview." />
  );
}
