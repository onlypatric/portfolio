import { SecureField } from "@/_components/common/ohmygui/input/SecureField";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";

export default function Example() {
  return (
    <VStack gap="lg">
      <SecureField label="Demo password" name="password" defaultValue="garden-2026" revealable autoComplete="off" helperText="Demo only; never a real password." />
      <SecureField label="Disabled password" defaultValue="not-editable" disabled />
    </VStack>
  );
}
