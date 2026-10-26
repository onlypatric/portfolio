import { useState } from "react";
import { Picker, UnevenRoundedRectangle, VStack } from "@/ohmygui";

const profiles = [
  { value: "balanced", label: "Balanced", topStart: 24, topEnd: 24, bottomStart: 24, bottomEnd: 24 },
  { value: "soft", label: "Soft diagonal", topStart: 40, topEnd: 8, bottomStart: 8, bottomEnd: 40 },
  { value: "opposed", label: "Opposed diagonal", topStart: 8, topEnd: 40, bottomStart: 40, bottomEnd: 8 },
] as const;

export default function Example() {
  const [profile, setProfile] = useState<(typeof profiles)[number]["value"]>("soft");
  const corners = profiles.find((item) => item.value === profile) ?? profiles[1];

  return (
    <VStack gap="md" align="start">
      <Picker label="Corner profile" value={profile} onChange={(event) => setProfile(event.currentTarget.value as typeof profile)} items={profiles.map(({ value, label }) => ({ value, label }))} />
      <UnevenRoundedRectangle
        aria-label={`${corners.label} rounded rectangle`}
        width={220}
        height={140}
        topStart={corners.topStart}
        topEnd={corners.topEnd}
        bottomStart={corners.bottomStart}
        bottomEnd={corners.bottomEnd}
        fill="var(--accent)"
        stroke="var(--foreground)"
        strokeWidth={4}
      />
    </VStack>
  );
}
