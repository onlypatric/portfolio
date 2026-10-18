import { Path } from "@/_components/common/ohmygui/drawing/Path";

export default function Example() {
  return (
    <Path aria-label="An upward curve" role="img" viewBox="0 0 240 120" d="M20 95 C60 15 100 115 140 50 S200 15 220 25" fill="none" stroke="var(--accent)" strokeWidth={8} strokeLinecap="round" style={{ width: "100%", maxWidth: 360, height: 180 }} />
  );
}
