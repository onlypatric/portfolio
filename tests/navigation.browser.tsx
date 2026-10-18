/**
 * Browser regression checks, with no test dependencies.
 * Start Astro dev, open /test/navigation, then run in its developer console:
 * import("/tests/navigation.browser.tsx").then(m => m.runNavigationChecks())
 * This module is outside src/pages and is not a production route or bundle import.
 */
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import type { ReactNode } from "react";
import {
  Breadcrumbs, NavigationLink, NavigationSplitView, NavigationStack, NavigationTitle,
  ResizableSplitPane, Searchable, Sidebar, Tab, TabBar, TabView, Toolbar, ToolbarItem,
} from "../src/_components/common/ohmygui/navigation";

export async function runNavigationChecks() {
  document.getElementById("navigation-checks")?.dispatchEvent(new Event("navigation-checks:dispose"));
  const host = document.createElement("section");
  host.id = "navigation-checks";
  host.setAttribute("aria-label", "Navigation regression checks");
  host.style.cssText = "position:fixed;inset:12px auto auto 12px;z-index:2147483647;background:white;color:#222;padding:12px;border:2px solid #222;width:1200px;max-height:90dvh;overflow:auto;font:14px system-ui";
  const stage = document.createElement("div"), output = document.createElement("pre");
  output.style.cssText = "white-space:pre-wrap;font:13px monospace";
  host.append(output, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [];
  const dispose = () => { root.unmount(); host.remove(); };
  host.addEventListener("navigation-checks:dispose", dispose, { once: true });
  const settle = (ms = 80) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => { const element = stage.querySelector<T>(selector); if (!element) throw new Error("Missing " + selector); return element; };
  const render = async (node: ReactNode, width = 1200) => {
    // Measure the fixture, not the padded results panel (or its scrollbar).
    host.style.width = width + 28 + "px"; stage.style.width = width + "px";
    flushSync(() => root.render(node)); await settle();
  };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await settle(); };
  const key = async (element: HTMLElement, value: string, options: KeyboardEventInit = {}) => { flushSync(() => element.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true, ...options }))); await settle(); };
  const type = async (value: string) => {
    const input = query<HTMLInputElement>("input");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await settle(10);
  };
  const check = async (name: string, test: () => Promise<void>) => {
    try { await test(); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: String(error) }); }
    output.textContent = results.map((result) => (result.passed ? "PASS " : "FAIL ") + result.name + (result.error ? ": " + result.error : "")).join("\n");
  };
  const long = <div style={{ height: 1000 }}><button>Focusable content</button>Long pane</div>;
  const split = <NavigationSplitView viewport={false} style={{ height: 420 }} sidebar={long} content={long} detail={long} />;

  await check("Split: desktop columns, collapse animation, inert sidebar, independent scroll", async () => {
    await render(split);
    const view = query('[data-ui="NavigationSplitView"]'), sidebar = query('[data-split-pane][data-slot="sidebar"]');
    assert(view.dataset.compact === "false", "Expected desktop mode");
    assert(getComputedStyle(view).transitionProperty.includes("grid-template-columns"), "Missing collapse transition");
    const content = query('[data-split-pane][data-slot="content"]'), detail = query('[data-split-pane][data-slot="detail"]');
    content.scrollTop = 100; detail.scrollTop = 160;
    assert(content.scrollTop === 100 && detail.scrollTop === 160 && sidebar.scrollTop === 0, "Scrolling is not independent");
    const originalWidth = sidebar.getBoundingClientRect().width;
    const closeButton = query<HTMLButtonElement>('[data-slot="toggle"]');
    const docked = closeButton.getBoundingClientRect(), sidebarBounds = sidebar.getBoundingClientRect();
    assert(Math.abs(sidebarBounds.top - view.getBoundingClientRect().top) < 2, "Desktop sidebar reserves a separate controls bar");
    assert(closeButton.dataset.floating === "false" && docked.left >= sidebarBounds.left && docked.right <= sidebarBounds.right && docked.top >= sidebarBounds.top, "Close button is not docked inside sidebar bounds");
    closeButton.focus();
    await click(closeButton);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const intermediateWidth = sidebar.getBoundingClientRect().width;
      assert(intermediateWidth > 0 && intermediateWidth < originalWidth, "Sidebar collapse jumps instead of animating");
    }
    await settle(300);
    assert(sidebar.inert && sidebar.getBoundingClientRect().width < 2, "Sidebar must collapse and leave the focus order");
    assert(query('[data-slot="toggle"]').getAttribute("aria-expanded") === "false", "Toggle state is not announced");
    assert(query('[data-slot="toggle"]') === closeButton && closeButton.dataset.floating === "true" && !closeButton.closest("[inert]"), "Reopen control must remain mounted and reachable");
    assert(document.activeElement === closeButton, "Collapse lost close-button focus");
    const floating = closeButton.getBoundingClientRect(), contentBounds = content.getBoundingClientRect();
    assert(Math.abs(contentBounds.top - view.getBoundingClientRect().top) < 2, "Floating control adds a separate top bar");
    assert(floating.left >= contentBounds.left && floating.right <= contentBounds.right && floating.top >= contentBounds.top, "Reopen button is not floating over content");
    await click(query('[data-slot="toggle"]')); await settle(300);
    assert(!sidebar.inert && sidebar.getBoundingClientRect().width > 100, "Sidebar did not reopen");
    assert(query('[data-slot="toggle"]') === closeButton && closeButton.dataset.floating === "false", "Close button did not snap back to its dock");
  });
  await check("Split: 375px container, all panes reachable, touch targets, Escape and retained scroll", async () => {
    await render(split, 375);
    const view = query('[data-ui="NavigationSplitView"]');
    assert(view.dataset.compact === "true", "Expected compact mode");
    const buttons = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-slot="paneButton"]'));
    assert(buttons.length === 3 && buttons.every((button) => button.getBoundingClientRect().height >= 44), "Pane controls need 44px targets");
    for (const button of buttons) {
      await click(button);
      const panes = Array.from(stage.querySelectorAll<HTMLElement>("[data-split-pane]"));
      assert(panes.filter((pane) => !pane.inert && getComputedStyle(pane).display !== "none").length === 1, "Only the selected pane should be interactive");
      assert(view.scrollWidth <= view.clientWidth + 1, "Mobile split overflows horizontally");
    }
    const detail = query('[data-split-pane][data-slot="detail"]'); detail.scrollTop = 110;
    await click(buttons[0]); await click(buttons[2]);
    assert(detail.scrollTop === 110, "Switching panes lost scroll position");
    await key(buttons[2], "Escape");
    assert(buttons[1].getAttribute("aria-pressed") === "true", "Escape should return to Content");
  });
  await check("Split: controlled callbacks, two panes, focus recovery, isolated nested collapse", async () => {
    let changed = false;
    await render(<NavigationSplitView viewport={false} style={{ height: 300 }} collapsed={false} onCollapsedChange={(value) => { changed = value; }} sidebar={long} content={long} />, 1100);
    await click(query('[data-slot="toggle"]'));
    assert(changed && query('[data-slot="toggle"]').getAttribute("aria-expanded") === "true", "Controlled state should request, not mutate");
    const sideButton = query<HTMLButtonElement>('[data-slot="sidebar"] button'); sideButton.focus();
    await render(<NavigationSplitView viewport={false} style={{ height: 300 }} collapsed sidebar={long} content={long} />, 1100);
    assert(document.activeElement === query('[data-slot="toggle"]'), "Focus stranded in hidden sidebar");
    await render(<NavigationSplitView viewport={false} collapsed style={{ height: 350 }} sidebar={long} content={<NavigationSplitView viewport={false} mobileBreakpoint={0} style={{ height: 200 }} sidebar={long} content={long} />} />, 1200);
    await settle(300);
    const views = stage.querySelectorAll<HTMLElement>('[data-ui="NavigationSplitView"]');
    assert(views[1].querySelector<HTMLElement>('[data-slot="sidebar"]')!.getBoundingClientRect().width > 100, "Outer collapse leaked into nested view");
    await render(<NavigationSplitView viewport={false} style={{ height: 300 }} content={long} />, 320);
    assert(stage.querySelectorAll('[data-slot="paneButton"]').length === 1, "Missing panes must not leave dead controls");
    let requestedPane = "";
    await render(<NavigationSplitView viewport={false} style={{ height: 300 }} mobilePane="content" onMobilePaneChange={(pane) => { requestedPane = pane; }} content={long} detail={long} />, 320);
    const controls = stage.querySelectorAll<HTMLButtonElement>('[data-slot="paneButton"]');
    await click(controls[1]);
    assert(requestedPane === "detail" && controls[0].getAttribute("aria-pressed") === "true", "Controlled mobile pane mutated instead of requesting selection");
  });
  await check("Sidebar and NavigationLink: animated disclosure, controlled state, disabled anchors", async () => {
    let changed = false, navigated = false;
    await render(<><Sidebar collapsible title="Pages" onCollapsedChange={(value) => { changed = value; }} items={[{ label: "Disabled", href: "/not-real", disabled: true }, { label: "Current", href: "#current", current: true }]} /><NavigationLink disabled href="#not-real" onClick={() => { navigated = true; }}>Unavailable</NavigationLink></>, 320);
    await click(query('[data-slot="toggle"]')); await settle(300);
    assert(changed && query('[data-slot="disclosure"]').inert, "Sidebar not inert while collapsed");
    assert(getComputedStyle(query('[data-slot="disclosure"]')).transitionProperty.includes("grid-template-rows"), "Disclosure has no height animation");
    await click(query('[data-slot="toggle"]'));
    const disabled = stage.querySelectorAll<HTMLAnchorElement>('a[aria-disabled="true"]');
    assert(disabled.length === 2 && Array.from(disabled).every((anchor) => !anchor.hasAttribute("href")), "Disabled anchors retain a destination");
    await click(disabled[1]); assert(!navigated, "Disabled navigation invoked callback");
    await render(<Sidebar collapsible collapsed={false} items={[{ label: "Link", href: "#current" }]} />, 320);
    await click(query('[data-slot="toggle"]'));
    assert(query('[data-slot="toggle"]').getAttribute("aria-expanded") === "true", "Controlled sidebar mutated its own state");
  });
  await check("Breadcrumbs and TabBar: all ancestors available, disabled routes, narrow overflow", async () => {
    const items = Array.from({ length: 7 }, (_, index) => ({ id: String(index), label: "Destination " + index, href: "#page-" + index, current: index === 6, disabled: index === 2 }));
    await render(<><Breadcrumbs items={items} /><TabBar items={items} /></>, 320);
    assert(stage.querySelectorAll('[data-ui="Breadcrumbs"] li a, [data-ui="Breadcrumbs"] li span[aria-current]').length === 7, "Collapsed breadcrumbs lost ancestors");
    await click(query("summary")); assert(query<HTMLDetailsElement>("details").open, "Native breadcrumb disclosure failed");
    assert(!query<HTMLAnchorElement>('[data-ui="TabBar"] a[aria-disabled]').hasAttribute("href"), "Disabled tab-bar link retains href");
    const bar = query('[data-ui="TabBar"] > ul'); assert(bar.scrollWidth > bar.clientWidth, "Tab bar should scroll, not crush labels");
    assert(getComputedStyle(query('[data-ui="Breadcrumbs"] > ol')).flexWrap === "wrap", "Breadcrumbs do not wrap");
  });
  await check("TabView and Tab: manual/automatic activation, RTL, disabled skipping and dynamic fallback", async () => {
    const tabs = [{ id: "a", label: "First very long tab", content: <p>First panel</p> }, { id: "b", label: "Disabled", disabled: true, content: "No" }, { id: "c", label: "Last very long tab", content: <p>Last panel</p> }];
    await render(<TabView activationMode="manual" tabs={tabs} />, 320);
    let buttons = stage.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons[0].focus(); await key(buttons[0], "ArrowRight");
    assert(document.activeElement === buttons[2] && buttons[0].getAttribute("aria-selected") === "true", "Manual tabs activated on focus or failed disabled skip");
    await click(buttons[2]); assert(buttons[2].getAttribute("aria-selected") === "true", "Manual activation failed");
    await key(buttons[2], "Home"); assert(document.activeElement === buttons[0], "Home did not focus first tab");
    await render(<div dir="rtl"><TabView tabs={tabs} /></div>, 320);
    buttons = stage.querySelectorAll<HTMLButtonElement>('[role="tab"]'); buttons[0].focus();
    await key(buttons[0], "ArrowLeft"); assert(buttons[2].getAttribute("aria-selected") === "true", "Inherited RTL was not honored");
    await render(<div dir="rtl"><TabView tabs={[tabs[0], { ...tabs[2], disabled: true }]} /></div>, 320);
    assert(stage.querySelectorAll('[role="tab"][tabindex="0"]:not(:disabled)').length === 1, "Dynamic tabs lost their tab stop");
    await render(<Tab id="test-disabled-tab" label="Disabled primitive" disabled active tabIndex={0} />, 320);
    assert(query("button").tabIndex === -1, "Disabled Tab remains in tab order");
  });
  await check("Tabs: symbol slots, selected icons, accessible badges and route semantics", async () => {
    const icon = <span>outline</span>, selectedIcon = <span>filled</span>;
    await render(<TabBar items={[{ id: "home", label: "Home", href: "#home", icon, selectedIcon, current: true, badge: <span aria-label="3 updates">3</span> }, { label: "Search", href: "#search", icon }]} />, 320);
    assert(!stage.querySelector('[role="tablist"]'), "Route navigation must not claim panel-tab semantics");
    assert(query('[aria-current="page"] [data-slot="icon"]').textContent === "filled", "Selected route icon is not used");
    assert(query('[data-slot="icon"]').getAttribute("aria-hidden") === "true", "Decorative symbols must not duplicate labels");
    assert(query('[data-slot="badge"]').textContent === "3", "Badge slot missing");
    assert(parseFloat(getComputedStyle(query('[data-slot="list"]')).borderTopLeftRadius) > 20, "Tab bar lost its capsule geometry");
    assert(query('[aria-current="page"]').getBoundingClientRect().height >= 44, "Tab bar target is too small");
    await render(<TabView tabs={[{ id: "a", label: "Home", icon, selectedIcon, content: "Home panel" }, { id: "b", label: "Search", icon, selectedIcon, content: "Search panel" }]} />, 320);
    const buttons = stage.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    assert(buttons[0].querySelector('[data-slot="icon"]')?.textContent === "filled", "Initial selected symbol missing");
    await click(buttons[1]);
    assert(buttons[1].querySelector('[data-slot="icon"]')?.textContent === "filled" && buttons[0].querySelector('[data-slot="icon"]')?.textContent === "outline", "Symbols did not follow panel selection");
  });
  await check("Searchable: debounce, clear, controlled sync, composition, submit and reset", async () => {
    const changes: string[] = [];
    const change = (value: string) => { changes.push(value); };
    let accessoryClicked = false;
    await render(<Searchable debounce={100} onQueryChange={change} onSubmit={(event) => event.preventDefault()} suggestions={["Sidebar", "Sidebar"]}
      startContent={<span aria-hidden="true">⌕</span>} endContent={<button type="button" onClick={() => { accessoryClicked = true; }}>Filters</button>}
      classNames={{ startContent: "test-search-start", endContent: "test-search-end" }} />, 320);
    const field = query('[data-slot="field"]');
    assert(field.firstElementChild === query('[data-slot="startContent"]') && field.lastElementChild === query('[data-slot="endContent"]'), "Search content slots are not ordered around the input");
    assert(query('[data-slot="startContent"]').classList.contains("test-search-start") && query('[data-slot="endContent"]').classList.contains("test-search-end"), "Search content slot classes are not forwarded");
    const input = query<HTMLInputElement>("input");
    assert(field.classList.contains("ui-field") && !input.classList.contains("ui-field"), "Search surface must surround the input and content slots");
    assert(getComputedStyle(input).backgroundColor === "rgba(0, 0, 0, 0)" && getComputedStyle(input).borderTopWidth === "0px", "Input still draws a separate field inside the shared surface");
    for (const slot of ["startContent", "endContent"]) {
      const bounds = query(`[data-slot="${slot}"]`).getBoundingClientRect(), surface = field.getBoundingClientRect();
      assert(bounds.left >= surface.left && bounds.right <= surface.right && bounds.top >= surface.top && bounds.bottom <= surface.bottom, "Search accessory is outside the field surface");
    }
    await click(query('[data-slot="startContent"]'));
    assert(document.activeElement === input, "Decorative icon does not focus the input");
    query<HTMLButtonElement>('[data-slot="endContent"] button').focus();
    await click(query('[data-slot="endContent"] button'));
    assert(accessoryClicked && !changes.length, "Interactive accessory changed the query or failed to activate");
    assert(document.activeElement === query('[data-slot="endContent"] button'), "Shared field steals interactive accessory focus");
    await type("one"); await type("two"); await settle(160);
    assert(changes.join(",") === "two", "Debounce emitted intermediate values");
    await key(query("input"), "Escape"); assert(changes.at(-1) === "" && query<HTMLInputElement>("input").value === "", "Escape did not clear search");
    flushSync(() => query("input").dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true })));
    await type("draft"); await settle(160); assert(changes.at(-1) === "", "Composition emitted incomplete input");
    flushSync(() => query("input").dispatchEvent(new CompositionEvent("compositionend", { bubbles: true })));
    await settle(160); assert(changes.at(-1) === "draft", "Composition final value not emitted");
    await render(<Searchable query="parent" debounce={100} onQueryChange={change} onSubmit={(event) => event.preventDefault()} />, 320);
    const count = changes.length; await settle(160);
    assert(query<HTMLInputElement>("input").value === "parent" && changes.length === count, "Controlled synchronization echoed a change");
    await type("submitted"); flushSync(() => query<HTMLFormElement>("form").requestSubmit());
    assert(changes.at(-1) === "submitted", "Submit did not flush debounce");
    flushSync(() => query<HTMLFormElement>("form").reset()); await settle();
    assert(query<HTMLInputElement>("input").value === "" && changes.at(-1) === "", "Native reset failed");
  });
  await check("Toolbar and ToolbarItem: wrapping, keyboard navigation, disabled skip, input key ownership", async () => {
    await render(<Toolbar overflow={<button>Overflow</button>}><ToolbarItem placement="leading"><button>First</button><button disabled>Disabled</button></ToolbarItem><ToolbarItem placement="trailing"><button>Last</button><input aria-label="Edit" /></ToolbarItem></Toolbar>, 320);
    const buttons = stage.querySelectorAll<HTMLButtonElement>("button"); buttons[0].focus();
    await key(buttons[0], "ArrowRight"); assert(document.activeElement === buttons[2], "Toolbar did not skip disabled button");
    await key(buttons[2], "End"); assert(document.activeElement === buttons[3], "Toolbar End failed");
    query<HTMLInputElement>("input").focus(); await key(query("input"), "ArrowLeft");
    assert(document.activeElement === query("input"), "Toolbar intercepted input arrow keys");
    assert(getComputedStyle(query('[data-slot="items"]')).flexWrap === "wrap", "Toolbar items should wrap");
  });
  await check("ResizableSplitPane: container adaptation, separator semantics, bounds, reset and RTL", async () => {
    let changed = 0;
    await render(<ResizableSplitPane style={{ height: 300 }} onRatioChange={(value) => { changed = value; }}><div>Primary</div><div>Secondary</div></ResizableSplitPane>, 320);
    let handle = query('[role="separator"]');
    assert(handle.getAttribute("aria-orientation") === "horizontal", "Narrow split should have a horizontal separator");
    await key(handle, "Home"); assert(changed === .2 && handle.getAttribute("aria-valuenow") === "20", "Minimum clamp failed");
    await key(handle, "End"); assert(Number(changed) === .8, "Maximum clamp failed");
    await key(handle, "ArrowDown"); assert(Number(changed) === .8, "Arrow escaped maximum");
    await render(<ResizableSplitPane dir="rtl" mobileBreakpoint={false} style={{ height: 300 }}><div>Primary</div><div>Secondary</div></ResizableSplitPane>, 1000);
    handle = query('[role="separator"]'); await key(handle, "Home"); const before = Number(handle.getAttribute("aria-valuenow"));
    await key(handle, "ArrowLeft"); assert(Number(handle.getAttribute("aria-valuenow")) > before, "RTL resize direction incorrect");
    flushSync(() => handle.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }))); await settle();
    assert(handle.getAttribute("aria-valuenow") === "50", "Double-click did not reset split");
    await render(<ResizableSplitPane resizable={false} min={NaN} max={NaN}><div>A</div><div>B</div></ResizableSplitPane>, 320);
    assert(query('[role="separator"]').tabIndex === -1 && !stage.innerHTML.includes("NaN"), "Disabled resize or nonfinite bounds failed");
  });
  await check("NavigationStack and NavigationTitle: semantic embedding, back link, keyed motion and wrapping", async () => {
    await render(<NavigationStack as="section" title="Example" backHref="#back" transitionKey="one"><NavigationTitle level={3} title="A very long responsive navigation title" subtitle="Details" trailing={<button>Action</button>} /></NavigationStack>, 320);
    assert(!stage.querySelector("main") && !!stage.querySelector("h3"), "Incorrect nested landmarks or heading level");
    assert(query<HTMLAnchorElement>('[data-slot="back"]').getAttribute("href") === "#back", "Missing back destination");
    const body = query('[data-slot="body"]'); assert(body.dataset.animated === "true", "Missing keyed transition hook");
    assert(getComputedStyle(query('[data-ui="NavigationTitle"]')).flexWrap === "wrap", "Title actions must wrap");
  });
  await check("Split: 320–1024px layout matrix and motion preferences", async () => {
    for (const width of [320, 375, 600, 760, 768, 1024]) {
      await render(split, width);
      const view = query('[data-ui="NavigationSplitView"]');
      assert(view.dataset.compact === String(width <= 760), "Incorrect breakpoint at " + width);
      assert(view.scrollWidth <= view.clientWidth + 1, "Horizontal overflow at " + width);
      const active = Array.from(stage.querySelectorAll<HTMLElement>("[data-split-pane]")).filter((pane) => !pane.inert);
      assert(active.length === (width <= 760 ? 1 : 3), "Incorrect active panes at " + width);
    }
    const motion = getComputedStyle(query('[data-ui="NavigationSplitView"]'));
    const duration = parseFloat(motion.transitionDuration);
    assert(matchMedia("(prefers-reduced-motion: reduce)").matches ? duration < .001 : duration > 0, "Transition does not respect motion preference");
  });
  const failures = results.filter((result) => !result.passed);
  const heading = document.createElement("h2"); heading.textContent = results.length + " navigation checks · " + failures.length + " failures"; host.prepend(heading);
  console.table(results); console.info("Navigation checks:", { total: results.length, failures: failures.length, reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches });
  return { total: results.length, failures, dispose };
}
