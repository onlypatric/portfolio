import { MaterialSurface } from "@/_components/common/ohmygui/drawing/MaterialSurface";
import { Text } from "@/_components/common/ohmygui/content/Text";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { useState } from "react";

export default function Example() {
  const [opaque, setOpaque] = useState(false);
  return (
    <div style={{ padding: 24, borderRadius: 16, background: "linear-gradient(120deg, #244c3a, #bad0a6)" }}>
      <MaterialSurface material={opaque ? false : { blur: "12px", opacity: .8 }} style={{ padding: 24, borderRadius: 12 }}>
      <Text as="p" weight="semibold">A little depth.</Text>
      <Text as="p">A translucent surface over a green gradient.</Text>
      <Button size="sm" variant="outline" onClick={() => setOpaque(value => !value)}>{opaque ? "Enable material" : "Use opaque surface"}</Button>
      </MaterialSurface>
      </div>
  );
}
