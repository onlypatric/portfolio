/** Run from the Astro development browser console:
 * import('/tests/workspace.browser.tsx').then(m => m.runWorkspaceChecks())
 */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Workspace, type WorkspaceSection } from "../src/pages/test/_components/common/workspace/Workspace";
import "../src/pages/test/_components/common/workspace/workspace.css";

export async function runWorkspaceChecks() {
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;inset:0;z-index:99999;background:white;overflow:auto";
  document.body.append(host);
  const stage = document.createElement("div");
  host.append(stage);
  const root = createRoot(stage);
  const results: string[] = [];
  const wait = () => new Promise(resolve => setTimeout(resolve, 120));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const element = stage.querySelector<T>(selector);
    if (!element) throw new Error("Missing " + selector);
    return element;
  };
  const button = (text: string) => {
    const element = [...stage.querySelectorAll<HTMLButtonElement>("button")].find(item => item.textContent === text);
    if (!element) throw new Error("Missing button " + text);
    return element;
  };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await wait(); };
  const render = async (section: WorkspaceSection, width: number) => {
    stage.style.width = width + "px";
    flushSync(() => root.render(<Workspace key={section + width} section={section} />));
    await wait();
  };
  try {
    await render("overview", 1100);
    assert(query("h1").textContent === "A clean slate.", "Overview title");
    assert(stage.querySelectorAll("main").length === 1, "Single main landmark");
    for (const href of ["/test", "/test/navigation", "/test/presentation"]) assert(stage.querySelector('a[href="' + href + '"]'), "Route link " + href);
    assert(query('[data-ui="NavigationSplitView"]').dataset.compact === "false", "Desktop split");
    await click(query('button[aria-label="Hide Workspace"]'));
    assert(query('[data-split-pane][data-slot="sidebar"]').inert, "Collapsed sidebar inert");
    results.push("PASS overview links, desktop split, collapse and landmark");

    await render("navigation", 1100);
    await click(button("A fresh direction"));
    const example = query(".test-example-split");
    assert(example.querySelector('[data-slot="detail"] h3')?.textContent === "A fresh direction", "Selection updates preview");
    assert(example.querySelector('[data-slot="detail"]')?.getAttribute("aria-hidden") !== "true", "Preview revealed");
    results.push("PASS navigation selection and embedded responsive preview");

    await render("presentation", 1100);
    const trigger = button("Create an idea");
    trigger.focus(); await click(trigger);
    const dialog = query<HTMLDialogElement>("dialog");
    assert(dialog.matches(":modal"), "Native modal open");
    assert(document.activeElement === query("dialog input"), "Modal autofocus");
    await click(button("Save idea"));
    assert(!dialog.isConnected && stage.textContent?.includes("My next idea — demo only"), "Save feedback");
    assert(document.activeElement === trigger, "Trigger focus restored: " + document.activeElement?.outerHTML.slice(0, 240));
    await click(trigger);
    const reopened = query<HTMLDialogElement>("dialog");
    flushSync(() => reopened.dispatchEvent(new Event("cancel", { cancelable: true })));
    await wait(); assert(!reopened.isConnected, "Escape cancel closes modal");
    results.push("PASS native modal, autofocus, save, cancellation and focus restoration");

    await render("overview", 375);
    const shell = query('[data-ui="NavigationSplitView"]');
    assert(shell.dataset.compact === "true", "Mobile split");
    await click(button("Workspace"));
    assert(!query('[data-split-pane][data-slot="sidebar"]').inert, "Mobile sidebar shown");
    await click(button("Page"));
    assert(query('[data-split-pane][data-slot="sidebar"]').inert, "Mobile sidebar hidden");
    assert(shell.scrollWidth <= 376, "No horizontal shell overflow");
    results.push("PASS 375px pane switching and overflow");
    console.log(results.join("\n"));
    return results;
  } finally { root.unmount(); host.remove(); }
}
