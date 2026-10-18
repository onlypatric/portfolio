import { LinearGradient } from "@/_components/common/ohmygui/drawing/LinearGradient";

export default function Example() {
  return (
    <LinearGradient aria-label="LinearGradient sample in green and cream" role="img" colors={["#244c3a", "#80a77d", "#eee8c7"]} style={{ width: "100%", height: 180, borderRadius: 16 }} />
  );
}
