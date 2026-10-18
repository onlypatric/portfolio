/** Astro dev console: import('/tests/showcase-shell.browser.tsx').then(m => m.runShowcaseShellChecks()) */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Showcase } from "../src/pages/ohmygui/_components/catalog/Showcase";
import "../src/pages/ohmygui/_components/catalog/showcase.css";

export async function runShowcaseShellChecks() {
  const host = document.createElement("section");
  host.style.cssText = "position:fixed;inset:0;z-index:99999;background:white;overflow:auto";
  const stage = document.createElement("div");
  host.append(stage); document.body.append(host);
  const root = createRoot(stage);
  const wait = () => new Promise(resolve => setTimeout(resolve, 350));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const element = stage.querySelector<T>(selector);
    if (!element) throw new Error("Missing " + selector);
    return element;
  };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await wait(); };
  try {
    stage.style.width = "1100px";
    flushSync(() => root.render(<Showcase entry={null} source="" />)); await wait();
    const view = query(".showcase-split"), sidebar = query('[data-split-pane][data-slot="sidebar"]');
    const content = query('[data-split-pane][data-slot="content"]');
    const toggle = query<HTMLButtonElement>('.showcase-split > [data-slot="controls"] > [data-slot="toggle"]');
    const top = view.getBoundingClientRect().top;
    assert(Math.abs(sidebar.getBoundingClientRect().top - top) < 2 && getComputedStyle(sidebar).paddingTop === "0px", "No reserved sidebar control strip");
    assert(Math.abs(content.getBoundingClientRect().top - top) < 2, "Content starts at the split's top edge");
    const brand = query(".showcase-brand").getBoundingClientRect(), dock = toggle.getBoundingClientRect();
    assert(dock.left >= brand.right - 1 && dock.top < brand.bottom, "Close button shares the brand row without overlap");
    toggle.focus(); await click(toggle);
    assert(sidebar.inert && toggle.dataset.floating === "true" && document.activeElement === toggle, "Floating reopen retains focus and hides sidebar");
    const header = query(".showcase-topbar").getBoundingClientRect();
    const floating = toggle.getBoundingClientRect(), crumbs = query('[data-ui="Breadcrumbs"]').getBoundingClientRect();
    assert(floating.top >= header.top && floating.bottom <= header.bottom + 1 && floating.right <= crumbs.left, `Reopen button fits the existing header without overlap: button=${JSON.stringify(floating)}, header=${JSON.stringify(header)}, crumbs=${JSON.stringify(crumbs)}`);
    assert(Math.abs(content.getBoundingClientRect().top - top) < 2 && getComputedStyle(content).paddingTop === "0px", "Closing does not insert a control strip");
    await click(toggle);
    assert(!sidebar.inert && toggle.dataset.floating === "false" && toggle.isConnected, "Same control docks again");
    assert([...stage.querySelectorAll("button")].every(button => button.hasAttribute("data-ui-button")), "Shared buttons only");
    stage.style.width = "375px"; await wait();
    assert(view.dataset.compact === "true", "Compact shell");
    await click(query('button[data-slot="paneButton"][aria-controls$="-sidebar"]'));
    assert(!sidebar.inert && getComputedStyle(toggle).display === "none", "Mobile pane controls replace desktop close button");
    await click(query('button[data-slot="paneButton"][aria-controls$="-content"]'));
    assert(sidebar.inert && view.scrollWidth <= 376, "Mobile content remains reachable without overflow");
    console.log("PASS showcase seamless dock/float/header integration, focus, shared buttons and 375px panes");
    return true;
  } finally { root.unmount(); host.remove(); }
}
