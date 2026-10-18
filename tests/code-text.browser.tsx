/** On Astro dev: import('/tests/code-text.browser.tsx').then(m => m.runCodeTextChecks()) */
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { CodeText } from "../src/_components/common/ohmygui/content/CodeText";
import { Button } from "../src/_components/common/ohmygui/control/button/Button";
import { ButtonGroup } from "../src/_components/common/ohmygui/control/button/ButtonGroup";

export async function runCodeTextChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  const fixtureStyle = document.createElement("style"); fixtureStyle.textContent = ".code-test-body { max-block-size: 160px; }";
  host.append(fixtureStyle, report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [];
  const wait = () => new Promise(resolve => setTimeout(resolve, 50));
  const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const source = 'const longValue = "' + "long-source-".repeat(45) + '";\n' + "const answer = 42;\n".repeat(30);
  let referenced: HTMLElement | null = null;
  function Example() {
    const [wrap, setWrap] = useState(false), [result, setResult] = useState("");
    const ref = useRef<HTMLElement>(null);
    return <><CodeText filename="a-very-long-file-name-for-narrow-layouts.example.tsx" language="tsx" ref={node => { ref.current = node; referenced = node; }} wrap={wrap} classNames={{ body: "code-test-body" }} actions={<>
      <Button size="sm" variant="ghost" aria-pressed={wrap} onClick={() => setWrap(value => !value)}>Wrap lines</Button>
      <Button size="sm" variant="outline" onClick={() => setResult(ref.current?.textContent ?? "")}>Copy value</Button>
      <Button size="sm" disabled>Disabled</Button>
    </>}>{source}</CodeText><output>{result}</output></>;
  }
  const check = async (name: string, test: () => Promise<void>) => {
    try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); }
    report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n");
  };
  await check("Responsive metadata/actions never overlap code or force page overflow (LTR/RTL, 240–900px)", async () => {
    flushSync(() => root.render(<Example />)); await wait();
    for (const dir of ["ltr", "rtl"]) for (const width of [240, 320, 600, 900]) {
      stage.dir = dir; stage.style.width = width + "px"; stage.style.maxWidth = "100%"; await wait();
      const container = q<HTMLElement>('[data-ui="CodeTextContainer"]'), actions = q<HTMLElement>('[data-slot="actions"]'), pre = q<HTMLPreElement>("pre");
      const frame = container.getBoundingClientRect(), controls = actions.getBoundingClientRect(), body = pre.getBoundingClientRect();
      assert(container.scrollWidth <= container.clientWidth + 1, `Outer overflow at ${width}/${dir}`);
      assert(controls.left >= frame.left - 1 && controls.right <= frame.right + 1 && controls.bottom <= body.top + 1, "Actions overlap or escape frame");
      assert(pre.scrollWidth > pre.clientWidth && pre.scrollHeight > pre.clientHeight, "Code is not independently scrollable");
      assert(getComputedStyle(actions).position !== "absolute", "Controls still use absolute positioning");
    }
  });
  await check("Actions stay put while scrolling; exact selectable source, refs, caller actions and wrapping work", async () => {
    stage.dir = "ltr"; stage.style.width = "320px"; await wait();
    const pre = q<HTMLPreElement>("pre"), actions = q<HTMLElement>('[data-slot="actions"]');
    const top = actions.getBoundingClientRect().top; pre.scrollTop = 120; pre.scrollLeft = 150; await wait();
    assert(Math.abs(actions.getBoundingClientRect().top - top) < 1, "Scrolling code moves action section");
    assert(referenced === q("code") && q("code").textContent === source && !pre.querySelector("button"), "Ref/source polluted by controls");
    const selection = getSelection()!, range = document.createRange(); range.selectNodeContents(q("code")); selection.removeAllRanges(); selection.addRange(range);
    // Native rendered-text selection may omit the final newline; DOM/caller copy remains exact.
    assert(range.toString() === source && [source, source.replace(/\n$/, "")].includes(selection.toString()), "Selection includes controls or alters source whitespace"); selection.removeAllRanges();
    const buttons = stage.querySelectorAll<HTMLButtonElement>("button"); flushSync(() => buttons[1].click()); await wait();
    assert(q("output").textContent === source, "Caller action did not receive exact source");
    flushSync(() => buttons[0].click()); await wait();
    assert(buttons[0].getAttribute("aria-pressed") === "true" && pre.scrollWidth <= pre.clientWidth + 1, "Wrap does not contain long code");
    pre.focus(); assert(document.activeElement === pre && pre.tabIndex === 0 && pre.getAttribute("aria-label")?.includes("source code"), "Keyboard-scroll region is inaccessible");
  });
  await check("Bare snippets stay inline; optional and legacy controls work; grouped full-mode actions fit", async () => {
    flushSync(() => root.render(<><CodeText inline>inline</CodeText><CodeText mode="snippet" copyButton={<Button size="sm">Legacy copy</Button>}>npm run dev</CodeText><CodeText filename="Grouped" actions={<ButtonGroup size="sm"><Button>Copy</Button><Button>More</Button></ButtonGroup>}>source</CodeText></>)); await wait();
    const inline = q<HTMLElement>('[data-ui="CodeText"]'); assert(getComputedStyle(inline).display === "inline" && inline.parentElement === stage, "Bare snippet gained block chrome");
    assert(q('[data-slot="copyButton"]').closest('[data-mode="snippet"]'), "Legacy snippet slot missing");
    assert(!stage.querySelector('pre button') && stage.querySelectorAll('[data-ui="ButtonGroup"] button').length === 2, "Grouped controls break code semantics");
    flushSync(() => root.render(<CodeText>plain</CodeText>)); await wait();
    assert(!stage.querySelector('[data-slot="header"], [data-slot="actions"]'), "Empty header/actions render by default");
  });
  const failures = results.filter(item => !item.passed); console.table(results);
  document.title = `CodeText: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
