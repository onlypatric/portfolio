import { Canvas } from "@/_components/common/ohmygui/drawing/Canvas";

export default function Example() {
  return (
    <Canvas aria-label="Three overlapping green circles" role="img" width={360} height={200} fallback="Three overlapping circles." draw={(context, canvas) => { const width = canvas.getBoundingClientRect().width; context.clearRect(0, 0, width, 200); ["#244c3a", "#638463", "#bad0a6"].forEach((color, index) => { context.fillStyle = color; context.beginPath(); context.arc(width * 0.35 + index * 35, 90, 48, 0, Math.PI * 2); context.fill(); }); }} />
  );
}
