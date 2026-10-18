import { AttributedText } from "@/_components/common/ohmygui/content/AttributedText";

export default function Example() {
  return (
    <AttributedText as="p" runs={["Build with ", { text: "small pieces", strong: true }, ", add ", { text: "a little emphasis", emphasis: true }, ", then ", { text: "explore the library", href: "/ohmygui" }, "."]} />
  );
}
