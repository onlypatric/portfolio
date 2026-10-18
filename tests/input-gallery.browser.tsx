/** Dev-only visual QA: real examples, no new route or production imports. */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import * as inputs from "../src/_components/common/ohmygui/input";
import { exampleModules } from "../src/pages/ohmygui/_components/catalog/ExamplePreview";

export async function mountInputGallery() {
  const host = document.createElement("section"), grid = document.createElement("div");
  host.setAttribute("aria-label", "Input family visual review");
  host.style.cssText = "position:fixed;inset:0;z-index:999999;overflow:auto;background:var(--background);color:var(--foreground);padding:24px";
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:24px;align-items:start";
  host.append(grid); document.body.append(host);
  const roots: ReturnType<typeof createRoot>[] = [];
  const names = Object.keys(inputs).sort();
  for (const name of names) {
    const load = exampleModules[`./examples/${name}.tsx`];
    if (!load) throw new Error(`Missing input example: ${name}`);
    const Example = (await load()).default;
    const card = document.createElement("article"), heading = document.createElement("h2"), stage = document.createElement("div");
    card.dataset.inputReview = name; heading.textContent = name;
    card.style.cssText = "min-width:0;padding:16px;border:1px solid var(--border);border-radius:16px";
    heading.style.cssText = "font:600 15px system-ui;margin:0 0 20px";
    stage.style.cssText = "display:grid;gap:12px;min-width:0";
    card.append(heading, stage); grid.append(card);
    const root = createRoot(stage); roots.push(root); flushSync(() => root.render(<Example />));
  }
  const appearance = (theme: "light" | "dark" = "light", dir: "ltr" | "rtl" = "ltr", compact = false) => {
    host.className = theme; host.dir = dir; host.dataset.uiDensity = compact ? "compact" : "comfortable";
  };
  appearance();
  return {
    host, names, appearance,
    show(name: string) { host.querySelector(`[data-input-review="${name}"]`)?.scrollIntoView({ block: "start" }); },
    dispose() { roots.forEach(root => root.unmount()); host.remove(); },
  };
}
