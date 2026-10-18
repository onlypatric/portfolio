/** Astro dev: import('/tests/input-pickers.browser.tsx').then(m => m.runPickerInputChecks()) */
import { type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Combobox, ColorPicker, FilePicker, Form, FieldGroup } from "../src/_components/common/ohmygui/input";

export async function runPickerInputChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:20px;width:500px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = (ms = 60) => new Promise(resolve => setTimeout(resolve, ms));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const fill = async (input: HTMLInputElement, value: string) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value); flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await wait(); };
  const key = async (input: HTMLInputElement, value: string, isComposing = false) => { const event = new KeyboardEvent("keydown", { key: value, isComposing, bubbles: true, cancelable: true }); flushSync(() => input.dispatchEvent(event)); await wait(); return event; };
  const files = async (input: HTMLInputElement, files: File[]) => { const data = new DataTransfer(); files.forEach(file => data.items.add(file)); input.files = data.files; flushSync(() => input.dispatchEvent(new Event("change", { bubbles: true }))); await wait(); };
  const focus = async (input: HTMLInputElement) => { flushSync(() => input.focus()); await wait(); };
  const check = async (name: string, test: () => Promise<void>) => { try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n"); };
  const options = [{ value: "studio", label: <span>Studio <em>North</em></span> }, { value: "archive", label: "Archive", disabled: true }, { value: "garden", label: <span>Garden</span>, textValue: "Garden outside" }];
  try {
    await check("Combobox filters rich labels, keeps DOM focus, skips disabled choices, handles IME/Escape/Enter and native reset", async () => {
      let changes = 0, latest = "";
      const ref = { current: null as HTMLInputElement | null };
      await render(<Form><Combobox ref={ref} label="Workspace" name="workspace" helperText="Choose or type" options={options} onValueChange={next => { changes++; latest = next; }} /></Form>);
      const input = q<HTMLInputElement>("input"); assert(ref.current === input && input.labels?.[0].textContent === "Workspace", "Combobox label/ref failed");
      await focus(input); assert(input.getAttribute("aria-expanded") === "true", "Focus did not open suggestions");
      await key(input, "ArrowUp"); assert(stage.querySelector('[id="' + input.getAttribute("aria-activedescendant") + '"]')?.textContent === "Garden", "ArrowUp did not start at last enabled choice");
      await key(input, "ArrowDown"); assert(q('[aria-selected="true"]').textContent === "Studio North", "Arrow wrap failed");
      await key(input, "ArrowDown"); assert(q('[aria-selected="true"]').textContent === "Garden", "Disabled option not skipped");
      assert(document.activeElement === input, "Combobox moved DOM focus to popup");
      assert(!(await key(input, "Home")).defaultPrevented, "Combobox stole text editing Home key");
      assert(!(await key(input, "Enter", true)).defaultPrevented && latest === "", "IME confirmation selected suggestion");
      assert((await key(input, "Enter")).defaultPrevented && input.value === "garden" && changes === 1, "Enter selection duplicated callback or submitted form");
      assert(new FormData(q<HTMLFormElement>("form")).get("workspace") === "garden", "Combobox native form value failed");
      await fill(input, "North"); assert(q('[role="option"]').textContent === "Studio North", "Nested text label not searchable");
      await key(input, "Escape"); assert(input.value === "North" && !stage.querySelector('[role="listbox"]:not([aria-hidden="true"])'), "Escape lost draft or popup stayed open");
      await fill(input, "outside"); assert(q('[role="option"]').textContent === "Garden", "Explicit textValue not searchable");
      await fill(input, "no matches"); assert(stage.textContent?.includes("No matches found.") && !input.hasAttribute("aria-activedescendant"), "Empty filter left stale ARIA target");
      q<HTMLFormElement>("form").reset(); await wait(); assert(input.value === "" && input.getAttribute("aria-expanded") === "false", "Combobox reset failed");
    });
    await check("Combobox bounds active scrolling, parent rejection, read-only/disabled and outside focus behavior", async () => {
      await render(<Combobox label="Many choices" options={Array.from({ length: 30 }, (_, index) => ({ value: String(index), label: "Option " + index }))} />);
      const input = q<HTMLInputElement>("input"); await focus(input); await key(input, "ArrowUp");
      const panel = q<HTMLElement>('[role="listbox"]'), active = q<HTMLElement>('[aria-selected="true"]');
      assert(panel.scrollTop > 0 && active.getBoundingClientRect().bottom <= panel.getBoundingClientRect().bottom + 1, "Keyboard highlight stayed outside scroll viewport");
      await render(<Combobox label="Parent controlled" value="" options={options} onValueChange={() => {}} />); await focus(q("input")); await key(q("input"), "ArrowDown"); await key(q("input"), "Enter"); assert(q<HTMLInputElement>("input").value === "", "Parent-controlled selection was overwritten");
      await render(<Combobox label="Read only" readOnly options={options} />); await focus(q("input")); await key(q("input"), "ArrowDown"); assert(!stage.querySelector('[role="listbox"]:not([aria-hidden="true"])'), "Read-only combobox opens");
      await render(<FieldGroup legend="Unavailable" disabled><Combobox label="Disabled" options={options} /></FieldGroup>); const disabled = q<HTMLInputElement>("input"); assert(disabled.matches(":disabled"), "Inherited disabled input lost native state"); await key(disabled, "ArrowDown"); assert(!stage.querySelector('[role="listbox"]:not([aria-hidden="true"])'), "Disabled combobox opened from keys");
      await render(<><Combobox label="No filter" autocomplete="none" defaultValue="not matched" options={options} /><ColorPicker label="Outside" /></>); await focus(q("input")); assert(stage.querySelectorAll('[role="option"]').length === 3, "No-autocomplete filtered options");
      await focus(q('input[type="color"]')); assert(!stage.querySelector('[role="listbox"]:not([aria-hidden="true"])'), "Blur did not close popup");
    });
    await check("Inline completion selects only its suffix, Escape restores the draft, Tab/blur commit once and parents can reject", async () => {
      const observed: string[] = [];
      await render(<Form key="inline"><Combobox label="Inline workspace" autocomplete="both" options={options} onValueChange={value => { observed.push(value); }} /><ColorPicker label="Outside" /></Form>);
      const input = q<HTMLInputElement>('[role="combobox"]'); await focus(input); await fill(input, "st");
      assert(input.value === "studio" && input.selectionStart === 2 && input.selectionEnd === 6 && input.getAttribute("aria-autocomplete") === "both", "Inline suffix not selected");
      await key(input, "Escape"); assert(input.value === "st", "Escape did not restore typed prefix");
      await fill(input, "stu"); const before = observed.length; await key(input, "Tab"); flushSync(() => q<HTMLInputElement>('[type="color"]').focus()); await wait();
      assert(input.value === "studio" && observed.length === before + 1 && observed.at(-1) === "studio", "Tab/blur completion committed twice or lost value");
      await render(<Combobox key="rejected-inline" label="Controlled inline" autocomplete="both" value="" options={options} onValueChange={() => {}} />); await focus(q("input")); await fill(q("input"), "st"); assert(q<HTMLInputElement>("input").value === "", "Inline completion overrode parent rejection");
    });
    await check("File selection validates actual native files, recovery, cancel, reset and disabled semantics without opening OS UI", async () => {
      let callback: File[] = [], cancelled = 0;
      const ref = { current: null as HTMLInputElement | null }, small = new File(["ok"], "small.png", { type: "image/png" }), large = new File(["oversized"], "large.png", { type: "image/png" });
      await render(<Form><FilePicker ref={ref} name="images" label="Images" multiple required maxSize={4} onCancel={() => cancelled++} onFilesChange={next => callback = next} /></Form>);
      const input = q<HTMLInputElement>("input"), form = q<HTMLFormElement>("form"); assert(ref.current === input && !form.checkValidity(), "Native file ref/required failed");
      await files(input, [small]); assert(input.files?.length === 1 && callback[0] === small && stage.textContent?.includes("small.png"), "Accepted file not reflected");
      assert((new FormData(form).get("images") as File).name === "small.png" && form.checkValidity(), "Valid file not native form value");
      input.dispatchEvent(new Event("cancel", { bubbles: true })); await wait(); assert(cancelled === 1 && input.files?.[0].name === "small.png", "Cancel removed existing selection");
      await files(input, [small, large]); assert(input.files?.length === 0 && callback.length === 0 && input.validity.customError && input.getAttribute("aria-invalid") === "true", "Oversized rejection left selected native files or no validation");
      assert(stage.textContent?.includes("4 bytes or smaller"), "Size error not visible");
      await files(input, [small]); assert(input.validity.valid && !input.hasAttribute("aria-invalid"), "Retry failed to clear custom validity");
      const stop = (event: Event) => event.preventDefault(); form.addEventListener("reset", stop); form.reset(); await wait(); assert(input.files?.length === 1, "Prevented file reset changed selection"); form.removeEventListener("reset", stop);
      form.reset(); await wait(); assert(input.files?.length === 0 && stage.textContent?.includes("No files selected") && !input.validity.customError, "File reset left stale status/validation");
      await render(<FilePicker label="Disabled files" disabled />); assert(q<HTMLInputElement>("input").disabled, "File disabled state lost");
    });
    await check("Color picker has live opaque value/ref/form/reset, controlled rejection and read-only activation protection", async () => {
      const ref = { current: null as HTMLInputElement | null };
      await render(<Form><ColorPicker ref={ref} name="color" label="Accent" defaultValue="#638463" /></Form>);
      const input = q<HTMLInputElement>("input"); assert(ref.current === input, "Color ref not native"); await fill(input, "#c0ffee");
      assert(q("output").textContent === "#C0FFEE" && new FormData(q<HTMLFormElement>("form")).get("color") === "#c0ffee", "Color output/form lost change");
      q<HTMLFormElement>("form").reset(); await wait(); assert(input.value === "#638463" && q("output").textContent === "#638463", "Color reset failed");
      await render(<ColorPicker label="Controlled" value="#123456" onChange={() => {}} />); await fill(q("input"), "#ffffff"); assert(q<HTMLInputElement>("input").value === "#123456", "Controlled color ignored parent rejection");
      await render(<ColorPicker label="Read only" value="#123456" readOnly />); assert((await key(q("input"), "Enter")).defaultPrevented && (await key(q("input"), " ")).defaultPrevented, "Read-only color picker activates by keyboard");
    });
    await check("Picker layouts remain bounded at 240px in both themes/directions with long names and suggestions", async () => {
      await render(<><Combobox label="Workspace" name="workspace" options={[{ value: "long", label: "AReallyLongWorkspaceNameThatMustNeverEscapeTheNarrowFieldSurface" }]} /><FilePicker label="Local files" name="files" /><ColorPicker label="Accent" defaultValue="#638463" /></>);
      stage.style.width = "240px"; await files(q('input[type="file"]'), [new File(["ok"], "a-very-long-local-filename-that-should-wrap-without-causing-horizontal-overflow.png")]);
      for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) {
        stage.className = theme; stage.dir = dir; await wait(); await focus(q('input[role="combobox"]')); await wait(180);
        for (const field of stage.querySelectorAll<HTMLElement>('[data-field-root]')) assert(field.scrollWidth <= field.clientWidth + 1, "Picker field overflows narrow layout");
        const panel = q<HTMLElement>('[role="listbox"]'); assert(panel.scrollWidth <= panel.clientWidth + 1, "Long suggestion overflows popup");
      }
      assert(!errors.length, errors.join("; "));
    });
  } finally { console.error = originalError; }
  const failures = results.filter(item => !item.passed); console.table(results); document.title = `Picker inputs: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
