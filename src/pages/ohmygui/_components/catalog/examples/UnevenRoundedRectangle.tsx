import { UnevenRoundedRectangle } from "@/_components/common/ohmygui/drawing/UnevenRoundedRectangle";

export default function Example() {
  return (
    <UnevenRoundedRectangle aria-label="Green rectangle with asymmetric corners" width={220} height={140} topStart={40} topEnd={8} bottomStart={8} bottomEnd={40} fill="var(--accent)" />
  );
}
