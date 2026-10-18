import { FlowLayout } from "@/_components/common/ohmygui/layout/FlowLayout";
import { Badge } from "@/_components/common/ohmygui/content/Badge";

export default function Example() {
  return (
    <FlowLayout gap="sm">{["Design", "Build", "Compose", "Refine", "Ship"].map((label) => <Badge key={label} tone="soft" variant="accent">{label}</Badge>)}</FlowLayout>
  );
}
