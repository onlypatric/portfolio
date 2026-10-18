import "../theme.css";
import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { Button, type ButtonProps } from "../control/button/Button";
import { twMerge } from "tailwind-merge";
import { TextField } from "./TextField";
import { useFormReset } from "./_useFormReset";

export type RenameButtonProps = Omit<ButtonProps, "onClick" | "onPress" | "onPressError" | "defaultValue" | "value"> & {
  commitStrategy?: "blur" | "submit"; defaultValue?: string; value?: string;
  onCommit?: (value: string) => void | Promise<void>;
};
export function RenameButton({ commitStrategy = "submit", defaultValue = "Untitled", onCommit, value, children = "Rename", ref, ...props }: RenameButtonProps) {
  const [editing, setEditing] = useState(false), [committed, setCommitted] = useState(defaultValue), [draft, setDraft] = useState(value ?? defaultValue);
  const [pending, setPending] = useState(false), [error, setError] = useState<string>();
  const unavailable = !!(props.disabled || props.loading || props.pending);
  const trigger = useRef<HTMLButtonElement>(null), editor = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const busy = useRef(false), version = useRef(0), restore = useRef(false);
  useImperativeHandle(ref, () => trigger.current!, []);
  useEffect(() => () => { version.current++; }, []);
  useLayoutEffect(() => { if (editing) input.current?.select(); }, [editing]);
  useLayoutEffect(() => { if (!editing && restore.current) { restore.current = false; trigger.current?.focus(); } }, [editing]);
  useFormReset(trigger, () => {
    if (busy.current) return;
    if (value === undefined) setCommitted(defaultValue);
    setDraft(value ?? defaultValue); setEditing(false); setError(undefined);
  }, props.form);
  const cancel = () => { if (busy.current) return; setError(undefined); restore.current = true; setEditing(false); };
  const commit = async (returnFocus: boolean) => {
    if (busy.current || unavailable || input.current?.matches(":disabled")) return;
    const next = draft.trim();
    if (!next) { setError("Enter a name before saving."); input.current?.focus(); return; }
    busy.current = true; setPending(true); setError(undefined); const currentVersion = version.current;
    try {
      await onCommit?.(next);
      if (version.current !== currentVersion) return;
      if (value === undefined) setCommitted(next);
      restore.current = returnFocus && (document.activeElement === document.body || !!editor.current?.contains(document.activeElement)); setEditing(false);
    } catch {
      if (version.current === currentVersion) setError("Unable to rename. Your draft is safe; try again.");
    } finally { if (version.current === currentVersion) { busy.current = false; setPending(false); } }
  };
  return <div data-ui="RenameButton" className="ui-action-flow">
    <Button {...props} ref={trigger} hidden={editing || props.hidden} data-slot="trigger" type="button" onClick={() => { setDraft(value ?? committed); setError(undefined); setEditing(true); }}>{children}</Button>
    {editing && <div ref={editor} data-slot="editor" role="group" aria-label="Rename" aria-busy={pending || undefined} className={twMerge("ui-rename-editor", props.className)} style={props.style}
      onBlur={event => { if (commitStrategy === "blur" && !event.currentTarget.contains(event.relatedTarget as Node)) void commit(false); }}
      onKeyDown={event => {
        if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return;
        if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); cancel(); }
        else if (event.key === "Enter" && event.target === input.current) { event.preventDefault(); void commit(true); }
      }}>
      <TextField ref={input} label="New name" form={props.form} autoFocus required readOnly={pending} disabled={unavailable} value={draft} error={error}
        onChange={event => { setDraft(event.currentTarget.value); if (error) setError(undefined); }} />
      <div className="ui-action-buttons">
        <Button type="button" size="sm" loading={pending} disabled={unavailable} onPointerDown={event => event.preventDefault()} onClick={() => void commit(true)}>Save</Button>
        <Button type="button" size="sm" variant="ghost" disabled={pending || unavailable} onPointerDown={event => event.preventDefault()} onClick={cancel}>Cancel</Button>
      </div>
    </div>}
  </div>;
}
