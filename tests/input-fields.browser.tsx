/** Astro dev console: import('/tests/input-fields.browser.tsx').then(m => m.runInputFieldChecks()) */
import { createRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { TextField, SecureField, TextEditor, SearchField, DatePicker, Picker, FieldGroup, Form, Button } from "../src/_components/common/ohmygui/input";

export async function runInputFieldChecks() {
  const host = document.createElement("section"), stage = document.createElement("div"), report = document.createElement("pre");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:var(--background);color:var(--foreground);padding:12px";
  stage.style.cssText = "display:grid;gap:16px;width:640px;max-width:100%"; host.append(report, stage); document.body.append(host);
  const root = createRoot(stage), results: { name: string; passed: boolean; error?: string }[] = [], errors: string[] = [];
  const originalError = console.error; console.error = (...args) => { errors.push(args.map(String).join(" ")); originalError(...args); };
  const wait = () => new Promise(resolve => setTimeout(resolve, 60));
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const q = <T extends HTMLElement>(selector: string) => { const node = stage.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const fill = async (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value);
    flushSync(() => input.dispatchEvent(new Event("input", { bubbles: true }))); await wait();
  };
  const check = async (name: string, test: () => Promise<void>) => {
    try { await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); }
    report.textContent = results.map(item => `${item.passed ? "PASS" : "FAIL"} ${item.name}${item.error ? ": " + item.error : ""}`).join("\n");
  };
  await check("Six fields have real labels/native refs and associated error/helper text without nested controls", async () => {
    const refs = Array.from({ length: 6 }, () => createRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>());
    await render(<><TextField ref={refs[0] as React.Ref<HTMLInputElement>} label="Title" helperText="Hint" /><SecureField ref={refs[1] as React.Ref<HTMLInputElement>} label="Secret" error="Error" /><SearchField ref={refs[2] as React.Ref<HTMLInputElement>} label="Search" suggestions={["One", "Two"]} /><TextEditor ref={refs[3] as React.Ref<HTMLTextAreaElement>} label="Note" /><DatePicker ref={refs[4] as React.Ref<HTMLInputElement>} label="Date" /><Picker ref={refs[5] as React.Ref<HTMLSelectElement>} label="Choice" items={[{ value: "one", label: "One" }]} /></>);
    for (const ref of refs) assert(ref.current?.labels?.length === 1, "Native label/ref missing");
    assert(!stage.querySelector("label button, label input"), "Interactive controls are still nested inside labels");
    for (const control of stage.querySelectorAll<HTMLElement>('[aria-describedby]')) for (const id of control.getAttribute("aria-describedby")!.split(" ")) assert(document.getElementById(id), "Missing description target");
  });
  await check("Adornments, long errors, focus and read-only states fit 240–640px in both directions/themes", async () => {
    await render(<><TextField label="A long descriptive field label that must wrap cleanly" startContent="https://" endContent={<Button size="sm" variant="ghost">Check</Button>} error="A long validation message should remain readable at narrow widths without moving over the input or buttons." defaultValue="example.com" /><SecureField label="Password" defaultValue="demo-only" /><TextField label="Identifier" readOnly defaultValue="immutable" /></>);
    for (const theme of ["light", "dark"]) for (const dir of ["ltr", "rtl"]) for (const width of [240, 375, 640]) {
      stage.className = theme; stage.dir = dir; stage.style.width = width + "px"; await wait();
      for (const frame of stage.querySelectorAll<HTMLElement>('[data-field-root], [data-slot="control"]')) assert(frame.scrollWidth <= frame.clientWidth + 1, `Field overflow ${width}/${dir}/${theme}: ${frame.dataset.ui ?? frame.dataset.slot} ${frame.scrollWidth}/${frame.clientWidth}`);
      const input = q<HTMLInputElement>("input"); input.focus(); await wait();
      const focusStyle = getComputedStyle(q('[data-slot="control"]'));
      assert(focusStyle.boxShadow !== "none" || (focusStyle.outlineStyle !== "none" && parseFloat(focusStyle.outlineWidth) > 0), "Frame focus ring missing");
    }
  });
  await check("Password reveal preserves value/caret, keyboard focus, disabled state and form reset", async () => {
    stage.className = "light"; stage.dir = "ltr";
    await render(<Form><SecureField label="Password" name="secret" defaultValue="demo-password" /><SecureField label="Disabled" disabled defaultValue="not-editable" /><FieldGroup legend="Locked" disabled><SecureField label="Inherited disabled" defaultValue="locked" /></FieldGroup></Form>);
    const input = q<HTMLInputElement>('input[name="secret"]'), node = input, button = q<HTMLButtonElement>('[data-slot="reveal"]');
    input.focus(); input.setSelectionRange(2, 6); flushSync(() => button.click()); await wait();
    assert(input === node && input.type === "text" && input.value === "demo-password" && input.selectionStart === 2 && input.selectionEnd === 6 && document.activeElement === input, "Reveal loses native value/caret/focus");
    button.focus(); flushSync(() => button.click()); await wait(); assert(document.activeElement === button && input.type === "password", "Keyboard reveal steals focus");
    for (const disabled of stage.querySelectorAll<HTMLButtonElement>('button:disabled')) { const target = document.getElementById(disabled.getAttribute("aria-controls")!) as HTMLInputElement; disabled.click(); assert(target.type === "password", "Disabled reveal activated"); }
    flushSync(() => button.click()); await wait(); assert(input.type === "text", "Second reveal failed");
    flushSync(() => q<HTMLFormElement>("form").reset()); await wait(); assert(input.type === "password" && input.value === "demo-password", "Reset did not restore secure native default");
  });
  await check("Native required/bounds/form values and uncontrolled reset remain functional", async () => {
    let submitted = 0;
    await render(<Form onSubmit={event => { event.preventDefault(); submitted++; }}><TextField label="Name" name="name" required defaultValue="Studio" /><TextEditor label="Note" name="note" defaultValue="Original" maxLength={30} /><SearchField label="Query" name="q" defaultValue="Badge" /><DatePicker label="Date" name="date" defaultValue="2026-10-18" min="2026-01-01" max="2026-12-31" /><Picker label="Space" name="space" defaultValue="one" items={[{ label: "One", value: "one" }, { label: "Two", value: "two" }]} /><TextField label="Disabled" name="disabled" defaultValue="excluded" disabled /><TextField label="Read only" name="readonly" defaultValue="included" readOnly /><Button type="submit">Submit</Button></Form>);
    const form = q<HTMLFormElement>("form"), data = new FormData(form);
    assert(data.get("name") === "Studio" && data.get("date") === "2026-10-18" && data.get("space") === "one" && !data.has("disabled") && data.get("readonly") === "included", "Native form values incorrect");
    const name = q<HTMLInputElement>('[name="name"]'); await fill(name, ""); assert(!form.checkValidity(), "Required validation lost");
    await fill(name, "Changed"); const note = q<HTMLTextAreaElement>("textarea"); await fill(note, "Changed note");
    form.requestSubmit(); await wait(); assert(submitted === 1, "Native submit failed");
    form.reset(); await wait(); assert(name.value === "Studio" && note.value === "Original", "Uncontrolled defaults did not reset");
    const date = q<HTMLInputElement>('[name="date"]'); await fill(date, "2027-01-01"); assert(date.validity.rangeOverflow, "Date constraints lost");
  });
  await check("Time/local datetime, multiple native selection and deduplicated datalist preserve browser contracts", async () => {
    await render(<Form><DatePicker mode="time" label="Time" name="time" defaultValue="09:30" min="09:00" max="17:00" step={900} /><DatePicker mode="datetime-local" label="Local date and time" name="local" defaultValue="2026-10-18T10:30" /><Picker label="Several spaces" name="spaces" multiple defaultValue={["a", "b"]} items={[{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "c", label: "Unavailable", disabled: true }]} /><SearchField label="Suggestions" suggestions={["Studio", "Studio", "Garden"]} /></Form>);
    const form = q<HTMLFormElement>("form"), data = new FormData(form);
    assert(data.get("time") === "09:30" && data.get("local") === "2026-10-18T10:30" && data.getAll("spaces").join() === "a,b", "Date modes or multiple values were transformed");
    assert(stage.querySelectorAll("datalist option").length === 2, "Duplicate native suggestions");
    const time = q<HTMLInputElement>('[name="time"]'); await fill(time, "08:30"); assert(time.validity.rangeUnderflow, "Time bounds missing"); form.reset(); await wait(); assert(time.value === "09:30", "Time reset failed");
  });
  await check("Controlled validation merges descriptions and group hints preserve native disabling", async () => {
    const groupRef = { current: null as HTMLFieldSetElement | null };
    function Controlled() { const [value, setValue] = useState("Valid"); return <><p id="field-test-help">External description</p><TextField label="Controlled" value={value} onChange={event => setValue(event.target.value)} helperText="Helpful" error={value.length < 3 ? "Too short" : undefined} aria-describedby="field-test-help" /><FieldGroup ref={groupRef} legend="Disabled fields" hint="Group hint" aria-describedby="field-test-help" disabled><TextField label="Locked" /></FieldGroup></>; }
    await render(<Controlled />); const input = q<HTMLInputElement>("input"); await fill(input, "x");
    assert(input.getAttribute("aria-invalid") === "true" && q('[data-slot="hint"]').textContent === "Too short", "Controlled validation did not update");
    assert(input.getAttribute("aria-describedby")?.startsWith("field-test-help "), "Caller description was overwritten");
    const group = q<HTMLFieldSetElement>("fieldset"); assert(groupRef.current === group && group.querySelector("input")?.matches(":disabled"), "Fieldset ref/disabling lost");
    for (const id of group.getAttribute("aria-describedby")!.split(" ")) assert(document.getElementById(id), "Group hint has no target");
    assert(!errors.length, errors.join("; "));
  });
  console.error = originalError; const failures = results.filter(item => !item.passed); console.table(results);
  document.title = `Input fields: ${results.length} checks, ${failures.length} failed`;
  return { results, failures, dispose: () => { root.unmount(); host.remove(); } };
}
