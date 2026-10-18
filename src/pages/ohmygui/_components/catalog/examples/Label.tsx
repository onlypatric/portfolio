import { Icon } from "@/_components/common/ohmygui/content/Icon";
import { Label } from "@/_components/common/ohmygui/content/Label";

export default function Example() {
  return (
    <Label icon={<Icon name="sparkle" size={24} />} title="A little attention to detail" />
  );
}
