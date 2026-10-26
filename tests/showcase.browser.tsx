/** Start Astro dev, open /ohmygui/button, then run in its console:
 * import('/tests/showcase.browser.tsx').then(m => m.runShowcaseChecks())
 * No production imports, uploads, sharing or clipboard reads.
 */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { catalog } from "../src/pages/ohmygui/_components/catalog/catalog";
import { exampleModules } from "../src/pages/ohmygui/_components/catalog/ExamplePreview";
import { Showcase } from "../src/pages/ohmygui/_components/catalog/Showcase";
import { RadioGroup } from "../src/ohmygui/input/RadioGroup";
import { SegmentedPicker } from "../src/ohmygui/input/SegmentedPicker";
import "../src/pages/ohmygui/_components/catalog/showcase.css";

export async function runShowcaseChecks() {
  const host = document.createElement("section");
  host.style.cssText = "position:fixed;inset:0;z-index:99999;background:white;color:black;overflow:auto";
  const stage = document.createElement("div"), report = document.createElement("pre");
  host.append(report, stage); document.body.append(host);
  const errors: string[] = [], warnings: string[] = [], passed: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => { warnings.push(args.map(String).join(" ")); originalError(...args); };
  const onError = (event: ErrorEvent) => errors.push(event.message);
  const onRejection = (event: PromiseRejectionEvent) => errors.push(String(event.reason));
  window.addEventListener("error", onError); window.addEventListener("unhandledrejection", onRejection);
  const root = createRoot(stage, { onUncaughtError: error => errors.push(String(error)) });
  const settle = (ms = 70) => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const result = stage.querySelector<T>(selector);
    if (!result) throw new Error("Missing " + selector);
    return result;
  };
  const button = (label: string) => {
    const found = [...stage.querySelectorAll<HTMLButtonElement>("button")].find(item => item.textContent === label);
    if (!found) throw new Error("Missing button " + label);
    return found;
  };
  const click = async (target: HTMLElement) => { flushSync(() => target.click()); await settle(); };
  const mount = async (name: string) => {
    const Example = (await exampleModules["./examples/" + name + ".tsx"]()).default;
    flushSync(() => root.render(<Example key={name} />)); await settle();
  };
  const note = (message: string) => { passed.push(message); report.textContent = passed.join("\n"); };
  const settings = ["ohmygui-showcase-theme", "ohmygui-showcase-density"].map(key => [key, localStorage.getItem(key)] as const);
  try {
    stage.style.cssText = "width:1100px;padding:24px";
    for (const entry of catalog) {
      await mount(entry.name);
      assert(stage.children.length > 0, entry.name + ": empty preview");
      assert([...stage.querySelectorAll("button")].every(button => button.hasAttribute("data-ui-button")), entry.name + ": bypasses the shared Button");
      assert(!errors.length, entry.name + ": " + errors.join("; "));
      note("PASS mount " + entry.name);
    }
    assert(!warnings.length, "React/browser warnings: " + warnings.join("; "));
    await mount("Button"); await click(button("Add a little"));
    assert(stage.textContent?.includes("Pressed 1 times."), "Button example state");
    await click(button("Reset")); assert(stage.textContent?.includes("Pressed 0 times."), "Button reset");
    await mount("ButtonGroup"); await click(button("Increase"));
    assert(stage.textContent?.includes("Quantity: 1"), "Grouped button action");
    assert(query<HTMLButtonElement>('[data-ui="ButtonGroup"] button').dataset.variant === "secondary", "Group variant inheritance");
    assert([...stage.querySelectorAll<HTMLButtonElement>('[data-ui="ButtonGroup"][aria-disabled="true"] button')].every(item => item.disabled), "Group disabled state");
    await mount("Checkbox"); await click(query("input"));
    assert(stage.textContent?.includes("Updates disabled."), "Checkbox example state");
    await mount("Toggle"); await click(query("input"));
    assert(stage.textContent?.includes("Quiet mode is on."), "Toggle example state");
    await mount("RadioGroup"); await click(query('input[value="monthly"]'));
    assert(stage.textContent?.includes("Selected: monthly"), "Controlled radio selection");
    flushSync(() => root.render(<RadioGroup name="uncontrolled" legend="Default selection" defaultValue="a" items={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />));
    await settle(); assert(query<HTMLInputElement>('input[value="a"]').checked, "Uncontrolled radio default");
    await click(query('input[value="b"]')); assert(query<HTMLInputElement>('input[value="b"]').checked, "Uncontrolled radio selection");
    await mount("SegmentedPicker"); await click(query('input[value="compact"]'));
    assert(stage.textContent?.includes("Density: compact"), "Controlled segmented selection");
    flushSync(() => root.render(<SegmentedPicker name="segments" defaultValue="a" choices={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />));
    await settle(); assert(query<HTMLInputElement>('input[value="a"]').checked, "Uncontrolled segmented default");
    await click(query('input[value="b"]')); assert(query<HTMLInputElement>('input[value="b"]').checked, "Uncontrolled segmented selection");
    await mount("Form"); await click(button("Say hello"));
    assert(stage.textContent?.includes("Hello, Alex!"), "Form example submission");
    await mount("TabView"); await click(button("Settings"));
    assert(query('[role="tab"][aria-selected="true"]').textContent === "Settings", "TabView selection");
    await mount("List"); await click(query('[data-ui="List"] li:nth-child(2) button'));
    assert(stage.textContent?.includes("Selected: two"), "List example selection");
    await mount("Refreshable"); await click(query("button")); await settle(500);
    assert(stage.textContent?.includes("revision 2"), "Refresh example state");
    note("PASS button, checkbox, toggle, form, tabs, list and async refresh interactions");

    for (const name of ["Dialog", "FullScreenCover", "ModalSurface"]) {
      await mount(name); const trigger = button("Open " + name); trigger.focus(); await click(trigger);
      assert(query<HTMLDialogElement>("dialog").matches(":modal"), name + ": native modal");
      assert(document.activeElement === query("dialog input"), name + ": initial field focus");
      await click(button("Save example"));
      await settle(180); // Retained native dialog releases after its fast exit animation.
      assert(stage.textContent?.includes("Your local example was saved."), name + ": save result");
      assert(!stage.querySelector("dialog:modal"), name + ": modal dismissed");
      assert(document.activeElement === trigger, name + ": trigger focus restored");
    }
    note("PASS all four modal examples open, save and dismiss");

    flushSync(() => root.render(<Showcase entry={null} source="" />)); await settle(180);
    assert(stage.querySelectorAll('nav[aria-label="All components"] a').length === catalog.length, "Shell complete directory");
    assert(stage.textContent?.includes(`${catalog.length} components`), "Shell inventory badge");
    const input = query<HTMLInputElement>('input[type="search"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "zz-no-component");
    flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await settle(200);
    assert(stage.textContent?.includes("No components match"), "Shell empty search");
    const toggles = stage.querySelectorAll<HTMLInputElement>('[data-ui="Toggle"] input');
    const wasDark = toggles[0].checked, wasCompact = toggles[1].checked;
    await click(toggles[0]); assert(query(".ohmy-showcase").dataset.theme === (wasDark ? "light" : "dark"), "Theme control");
    await click(toggles[1]); assert(query(".ohmy-showcase").dataset.uiDensity === (wasCompact ? "comfortable" : "compact"), "Density control");
    stage.style.width = "375px"; stage.style.padding = "0"; await settle(150);
    assert(query('[data-ui="NavigationSplitView"]').dataset.compact === "true", "Narrow shell");
    await click(button("Components"));
    assert(!query('[data-split-pane][data-slot="sidebar"]').inert, "Mobile directory revealed");
    await click(button("Showcase"));
    assert(query('[data-split-pane][data-slot="sidebar"]').inert, "Mobile directory hidden");
    note("PASS full shell directory, empty search, theme, density and 375px panes");
    assert(!errors.length && !warnings.length, "Runtime errors/warnings: " + [...errors, ...warnings].join("; "));
    console.log(passed.join("\n"));
    return { mounted: catalog.length, passed, errors, warnings };
  } finally {
    root.unmount(); host.remove(); console.error = originalError;
    window.removeEventListener("error", onError); window.removeEventListener("unhandledrejection", onRejection);
    for (const [key, value] of settings) { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value); }
  }
}
