/** Schedule from Astro dev, then close DevTools so the page can receive focus. APIs are scoped mocks, never real clipboard/share. */
import { Fragment, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Button, ButtonGroup, PasteButton, ShareLink, Form, TextField } from "../src/ohmygui/input";

export async function runActionInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const unhandled = (event: PromiseRejectionEvent) => errors.push("Unhandled rejection: " + String(event.reason)); window.addEventListener("unhandledrejection", unhandled);
  const originals = new Map(["clipboard", "share", "canShare"].map(key => [key, Object.getOwnPropertyDescriptor(navigator, key)]));
  const mock = (key: string, value: unknown) => Object.defineProperty(navigator, key, { configurable: true, value });
  const wait = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const button = (text: string) => { const found = [...stage.querySelectorAll<HTMLButtonElement>("button")].find(button => button.textContent === text); if (!found) throw new Error("Missing button " + text); return found; };
  const click = async (element: HTMLElement) => { flushSync(() => element.click()); await wait(); };
  const fill = async (input: HTMLInputElement, value: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value); flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await wait(); };
  const key = async (element: HTMLElement, value: string) => { const event = new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true }); flushSync(() => element.dispatchEvent(event)); await wait(); return event; };
  const pointer = (element: HTMLElement, type: string, button = 0) => flushSync(() => element.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, button })));
  const deferred = () => { let resolve!: () => void, reject!: (error: unknown) => void; const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  try {
    await check("Button async pending precedence, duplicate guards, focus, rejection/retry and unmount cleanup", async () => {
      let presses = 0, clicks = 0, ownedErrors = 0; const task = deferred(), ref = { current: null as HTMLButtonElement | null };
      await render(<Button ref={ref} loading={false} onClick={() => clicks++} onPress={() => { presses++; return task.promise; }}>Save</Button>);
      const save = q<HTMLButtonElement>("button"); assert(ref.current === save, "Button native ref failed"); save.focus(); await click(save); await click(save);
      assert(presses === 1 && clicks === 1 && save.disabled && save.getAttribute("aria-busy") === "true", "Pending allows duplicate or loading=false hides pending");
      task.resolve(); await wait(); assert(!save.disabled && document.activeElement === save, "Async completion did not restore availability/focus");
      await render(<Button onPress={() => Promise.reject(new Error("sample"))} onPressError={() => { ownedErrors++; }}>Reject</Button>); await click(q("button")); assert(ownedErrors === 1 && !q<HTMLButtonElement>("button").disabled, "Owned rejection did not recover");
      await render(<Button onPress={() => Promise.reject(new Error("sample"))}>Fallback</Button>); await click(q("button")); assert(q("[role=alert]").textContent?.includes("Action failed") && q("button").hasAttribute("aria-describedby"), "Default rejection is silent or unassociated");
      await render(<Button onPress={() => { presses++; }}>Sync</Button>); await click(q("button")); assert(!q<HTMLButtonElement>("button").disabled && !stage.querySelector('[data-slot="spinner"]'), "Synchronous press leaves artificial loading");
      const pending = deferred(); await render(<Button onPress={() => pending.promise}>Unmount</Button>); await click(q("button")); await render(<div>Removed</div>); pending.reject(new Error("late")); await wait();
    });
    await check("Long press uses transform, cancels on release/disable/unmount, preserves owner and keyboard activation", async () => {
      let presses = 0, owner: HTMLButtonElement | null = null;
      await render(<Button longPress={140} onPress={event => { presses++; owner = event.currentTarget; }}>Hold</Button>); const hold = q<HTMLButtonElement>("button");
      pointer(hold, "pointerdown"); await wait(30); pointer(hold, "pointerup"); await wait(160); assert(presses === 0, "Short pointer hold activated");
      pointer(hold, "pointerdown", 2); await wait(160); assert(presses === 0, "Secondary pointer activated");
      pointer(hold, "pointerdown"); await wait(170); assert(presses === 1 && owner === hold, "Long press did not retain currentTarget");
      assert(q<HTMLElement>('[data-slot="longPress"]').style.transition.startsWith("transform"), "Hold animates layout width");
      pointer(hold, "pointerup"); flushSync(() => hold.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }))); await wait(); assert(presses === 1, "Release duplicated hold action");
      await click(hold); assert(presses === 2, "Keyboard/assistive click blocked by longPress");
      pointer(hold, "pointerdown"); await render(<Button longPress={140} disabled onPress={() => { presses++; }}>Hold</Button>); await wait(180); assert(presses === 2, "Disabling left a live hold timer");
      await render(<Button key="remove" longPress={140} onPress={() => { presses++; }}>Remove</Button>); pointer(q("button"), "pointerdown"); await render(<div>Removed</div>); await wait(180); assert(presses === 2, "Unmount left a live action");
    });
    await check("Native button submit/reset and joined group refs, composition, disabling and narrow logical corners", async () => {
      let submits = 0, presses = 0; const ref = { current: null as HTMLDivElement | null };
      await render(<Form onSubmit={event => { event.preventDefault(); submits++; }}><TextField label="Name" name="name" defaultValue="Studio" /><ButtonGroup ref={ref} aria-label="Actions"><Fragment><Button onClick={() => { presses++; }}>Local</Button>{false}<Button type="submit">Submit</Button></Fragment><Button type="reset">Reset</Button></ButtonGroup></Form>);
      assert(ref.current === q('[data-ui="ButtonGroup"]'), "Group ref failed"); await click(button("Local")); assert(submits === 0 && presses === 1, "Default Button submits form");
      await click(button("Submit")); assert(submits === 1, "Native submit failed/duplicated"); await fill(q("input"), "Edited"); await click(button("Reset")); assert(q<HTMLInputElement>("input").value === "Studio", "Native reset failed");
      const pendingSubmit = deferred();
      await render(<Form key="async-submit" onSubmit={event => { event.preventDefault(); submits++; }}><Button type="submit" onPress={() => pendingSubmit.promise}>Async submit</Button></Form>);
      await click(button("Async submit")); const nativeSubmitted = submits === 2; pendingSubmit.resolve(); await wait(); assert(nativeSubmitted, "Async pending suppressed native submit default action");
      await render(<ButtonGroup disabled aria-label="Unavailable"><Button disabled={false}>Child</Button></ButtonGroup>); assert(q<HTMLButtonElement>("button").disabled, "Group disabling lost to child override");
      await render(<ButtonGroup fullWidth aria-label="Joined"><Button>AVeryLongActionNameThatMustWrap</Button><Button>AnotherLongActionName</Button></ButtonGroup>); stage.style.width = "240px";
      for (const dir of ["ltr", "rtl"]) { stage.dir = dir; await wait(); const group = q<HTMLElement>('[data-ui="ButtonGroup"]'); assert(group.scrollWidth <= group.clientWidth + 1, "ButtonGroup overflows narrow view"); const first = getComputedStyle(q("button")); assert(parseFloat(first.borderStartStartRadius) > 0 && first.borderStartEndRadius === "0px", "Logical outer corners lost"); }
      stage.dir = "ltr"; stage.style.width = "500px";
    });
    await check("Paste handles text/HTML format choice, callback failure, denied/unavailable/empty content and pending without real clipboard access", async () => {
      let value = "", format = "", reads = 0;
      mock("clipboard", { readText: async () => { reads++; return "local sample"; } });
      await render(<PasteButton onPasteEvent={(text, kind) => { value = text; format = kind; }}>Paste</PasteButton>); await click(button("Paste")); assert(value === "local sample" && format === "text" && reads === 1 && stage.textContent?.includes("Text pasted"), "Text read/feedback failed");
      const html = '<img src="invalid" onerror="window.__unexpectedPaste=true">'; mock("clipboard", { read: async () => [{ types: ["text/plain", "text/html"], getType: async (mime: string) => new Blob([mime === "text/html" ? html : "plain"]) }] });
      await render(<PasteButton formats={["html", "text"]} onPasteEvent={(text, kind) => { value = text; format = kind; }}>Paste</PasteButton>); await click(button("Paste")); assert(value === html && format === "html" && !stage.querySelector("img"), "HTML preference missing or untrusted markup injected");
      mock("clipboard", { readText: async () => "", read: async () => [{ types: ["text/html"], getType: async () => new Blob([html]) }] });
      await render(<PasteButton formats={["text", "html"]} onPasteEvent={(text, kind) => { value = text; format = kind; }}>Paste</PasteButton>); await click(button("Paste")); assert(value === html && format === "html", "Missing plain-text representation did not fall back to requested HTML");
      mock("clipboard", { readText: async () => "sample" }); await render(<PasteButton onPasteEvent={() => Promise.reject(new Error("consumer"))}>Paste</PasteButton>); await click(button("Paste")); assert(stage.textContent?.includes("Unable to apply"), "Consumer failure misreported as clipboard denial");
      mock("clipboard", { readText: async () => { throw new DOMException("sample", "NotAllowedError"); } }); await click(button("Paste")); assert(stage.textContent?.includes("Clipboard access failed"), "Denied clipboard lacks recovery");
      mock("clipboard", undefined); await click(button("Paste")); assert(stage.textContent?.includes("unavailable"), "Unavailable API missing fallback");
      mock("clipboard", { readText: async () => "" }); await click(button("Paste")); assert(stage.textContent?.includes("no content"), "Empty clipboard looks like success/failure");
      const task = deferred(); mock("clipboard", { readText: async () => { reads++; await task.promise; return "later"; } }); await render(<PasteButton>Paste</PasteButton>); const before = reads; await click(button("Paste")); await click(button("Paste")); assert(reads === before + 1 && button("Paste").disabled, "Pending paste read duplicated"); task.resolve(); await wait();
    });
    await check("Share validates capabilities/files/URLs, distinguishes cancellation and offers explicit copy/manual fallback", async () => {
      let calls = 0, copies = 0, data: ShareData | undefined, copied = "";
      mock("share", async (next: ShareData) => { calls++; data = next; }); mock("canShare", () => true); mock("clipboard", { writeText: async (next: string) => { copies++; copied = next; } });
      await render(<ShareLink title="Studio" url="/notes">Share</ShareLink>); await click(button("Share")); assert(calls === 1 && data?.url === new URL("/notes", document.baseURI).href && stage.textContent?.includes("Shared."), "Share payload/success failed");
      mock("share", async () => { throw new DOMException("sample", "AbortError"); }); await click(button("Share")); assert(stage.textContent?.includes("cancelled") && !stage.querySelector('[data-slot="fallback"]'), "User cancellation treated as failure/copy");
      mock("canShare", () => false); await render(<ShareLink url="/notes" files={[new File(["x"], "sample.txt") ]}>Share</ShareLink>); await click(button("Share")); assert(copies === 0 && stage.textContent?.includes("not files") && q<HTMLInputElement>("input").readOnly, "Unsupported files silently dropped or auto-copied");
      await click(button("Copy link")); assert(copies === 1 && copied === new URL("/notes", document.baseURI).href && stage.textContent?.includes("Link copied"), "Explicit copy fallback failed");
      mock("clipboard", { writeText: async () => { throw new Error("sample"); } }); await click(button("Copy link")); assert(stage.textContent?.includes("copy it manually"), "Denied copy has no manual recovery");
      mock("share", undefined); mock("clipboard", undefined); await render(<ShareLink text="Local sample">Share</ShareLink>); await click(button("Share")); assert(q<HTMLInputElement>("input").value === "Local sample" && ![...stage.querySelectorAll('button')].some(button => button.textContent === "Copy text"), "Unsupported API/clipboard lacks manual text fallback");
      await render(<ShareLink url="javascript:alert(1)">Share</ShareLink>); await click(button("Share")); assert(stage.textContent?.includes("valid shareable URL") && !stage.querySelector('[data-slot="fallback"]'), "Unsafe URL offered as share/copy");
      await render(<ShareLink>Share</ShareLink>); await click(button("Share")); assert(stage.textContent?.includes("Provide a link"), "Empty share payload accepted");
    });
    await check("Action surfaces stay within 240px light/dark/RTL and retain labelled keyboard targets", async () => {
      mock("share", undefined); mock("clipboard", undefined);
      await render(<><Button longPress={400} onPress={() => {}}>Keyboard hold alternative</Button><PasteButton>Paste</PasteButton><ShareLink url="https://example.com/a-long-link-for-local-layout-only">Share</ShareLink></>);
      await click(button("Share")); stage.style.width = "240px";
      for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) { stage.className = theme; stage.dir = dir; await wait(); for (const element of stage.querySelectorAll<HTMLElement>('.ui-action-flow')) assert(element.scrollWidth <= element.clientWidth + 1, "Action surface overflows narrow layout"); }
      assert(!errors.length, errors.join("; "));
    });
  } finally {
    originals.forEach((descriptor, key) => { if (descriptor) Object.defineProperty(navigator, key, descriptor); else Reflect.deleteProperty(navigator, key); });
    console.error = originalError; window.removeEventListener("unhandledrejection", unhandled);
  }
  const failures = results.filter(item => !item.passed); console.table(results); document.title = `Action inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
