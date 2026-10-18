import { ContainerRelativeFrame } from "@/_components/common/ohmygui/layout/ContainerRelativeFrame";

export default function Example() {
  return (
    <div style={{ containerType: "inline-size", width: "100%", border: "1px dashed var(--border)" }}>
      <ContainerRelativeFrame fraction={0.7} style={{ padding: 24, background: "var(--ui-selection)" }}>70% of this container</ContainerRelativeFrame>
      </div>
  );
}
