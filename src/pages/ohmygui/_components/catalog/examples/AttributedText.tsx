import { AttributedText } from "@/ohmygui";

export default function Example() {
  return (
    <AttributedText
      as="p"
      runs={[
        "Compose ",
        { text: "small pieces", strong: true },
        ", add ",
        { text: "emphasis", emphasis: true },
        " and ",
        { text: "inline code", code: true },
        ", then ",
        {
          text: "open the library",
          href: "/ohmygui",
          target: "_blank",
        },
        ".",
      ]}
    />
  );
}
