import { useState } from "react";
import { VStack } from "@/_components/common/ohmygui/layout/VStack";
import { Tab } from "@/_components/common/ohmygui/navigation/Tab";
import { HouseIcon, HeartIcon } from "@phosphor-icons/react";

export default function Example() {
  const [active, setActive] = useState("first");
  return (
    <VStack gap="md">
      <div className="ui-tab-list" role="tablist" aria-label="Example tabs" onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? "first" : event.key === "End" ? "second" : active === "first" ? "second" : "first"; setActive(next); document.getElementById("sample-tab-" + next)?.focus(); } }}>
      <Tab id="sample-tab-first" label="Home" icon={<HouseIcon />} selectedIcon={<HouseIcon weight="fill" />} active={active === "first"} aria-controls="sample-panel-first" onClick={() => setActive("first")} />
      <Tab id="sample-tab-second" label="Favorites" icon={<HeartIcon />} selectedIcon={<HeartIcon weight="fill" />} active={active === "second"} aria-controls="sample-panel-second" onClick={() => setActive("second")} />
      </div>
      <section role="tabpanel" id="sample-panel-first" aria-labelledby="sample-tab-first" hidden={active !== "first"} tabIndex={0}>Recent updates · 4 items</section>
      <section role="tabpanel" id="sample-panel-second" aria-labelledby="sample-tab-second" hidden={active !== "second"} tabIndex={0}>Saved articles · 12 items</section>
      </VStack>
  );
}
