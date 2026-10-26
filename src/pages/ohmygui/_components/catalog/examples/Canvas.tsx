import { useCallback, useState } from "react";
import { Canvas, HStack, Picker, VStack } from "@/ohmygui";

export default function Example() {
  const [pattern, setPattern] = useState<"circles" | "bars">("circles");
  const [resolution, setResolution] = useState("2");
  const draw = useCallback((context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { width, height } = canvas.getBoundingClientRect();
    context.clearRect(0, 0, width, height);
    const colors = ["--accent", "--success", "--warning"].map((token) => getComputedStyle(canvas).getPropertyValue(token).trim());
    if (pattern === "circles") {
      colors.forEach((color, index) => {
        context.fillStyle = color;
        context.beginPath();
        context.arc(width * 0.35 + index * 35, height / 2, 48, 0, Math.PI * 2);
        context.fill();
      });
    } else {
      colors.forEach((color, index) => {
        context.fillStyle = color;
        const barHeight = 50 + index * 35;
        context.fillRect(44 + index * 86, height - barHeight, 56, barHeight);
      });
    }
  }, [pattern]);

  return (
    <VStack gap="md" align="stretch">
      <HStack gap="md" wrap>
        <Picker label="Drawing" value={pattern} onChange={(event) => setPattern(event.currentTarget.value as typeof pattern)} items={[{ value: "circles", label: "Overlapping circles" }, { value: "bars", label: "Bars" }]} />
        <Picker label="Resolution scale" value={resolution} onChange={(event) => setResolution(event.currentTarget.value)} items={[{ value: "1", label: "1×" }, { value: "2", label: "2×" }, { value: "3", label: "3×" }]} />
      </HStack>
      <Canvas
        aria-label={pattern === "circles" ? "Three overlapping circles in theme colors" : "Three bars of increasing height in theme colors"}
        role="img"
        width={360}
        height={200}
        resolution={Number(resolution)}
        fallback={pattern === "circles" ? "Three overlapping circles in theme colors." : "Three bars of increasing height in theme colors."}
        draw={draw}
      />
    </VStack>
  );
}
