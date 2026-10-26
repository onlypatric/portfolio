import { Button } from "../control/button/Button";
import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme.css";

export type SearchableProps = UIProps & ComponentPropsWithoutRef<"form"> & {
  debounce?: number;
  onQueryChange?: (query: string) => void;
  query?: string;
  defaultQuery?: string;
  queryParam?: string;
  suggestions?: string[];
  label?: string;
  placeholder?: string;
  clearable?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  inputProps?: Omit<ComponentPropsWithoutRef<"input">, "value" | "defaultValue" | "name" | "type" | "list">;
  classNames?: Partial<Record<"label" | "input" | "clear" | "field" | "startContent" | "endContent", string>>;
};
export function Searchable({
  className, classNames = {}, debounce = 150, label = "Search", onQueryChange, placeholder, query, defaultQuery = "",
  queryParam = "q", suggestions = [], clearable = true, startContent, endContent, inputProps = {}, onSubmit, onReset, ...props
}: SearchableProps) {
  const [draft, setDraft] = useState(query ?? defaultQuery), [composing, setComposing] = useState(false);
  const id = useId(), input = useRef<HTMLInputElement>(null), callback = useRef(onQueryChange), lastSent = useRef(query ?? defaultQuery);
  callback.current = onQueryChange;
  useEffect(() => { if (query !== undefined) { lastSent.current = query; setDraft(query); } }, [query]);
  const emit = (value: string) => { if (lastSent.current !== value) { lastSent.current = value; callback.current?.(value); } };
  useEffect(() => {
    if (composing || lastSent.current === draft) return;
    const timer = window.setTimeout(() => emit(draft), Math.max(0, debounce));
    return () => window.clearTimeout(timer);
  }, [draft, debounce, composing]);
  const clear = () => { setDraft(""); emit(""); input.current?.focus(); };
  return <form method="get" {...props} data-ui="Searchable" data-clearable={clearable} role="search" aria-label={props["aria-label"] ?? label}
    onSubmit={(event) => { onSubmit?.(event); if (!composing) emit(draft); }}
    onReset={(event) => { onReset?.(event); if (!event.defaultPrevented) { setDraft(defaultQuery); emit(defaultQuery); } }}
    className={twMerge("ui-searchable", className)}>
    <label htmlFor={inputProps.id ?? id} data-slot="label" className={classNames.label}>{label}</label>
    <div data-slot="field" data-disabled={inputProps.disabled || undefined}
      data-invalid={inputProps["aria-invalid"] === true || inputProps["aria-invalid"] === "true" || undefined}
      onClick={(event) => {
        if (!(event.target as Element).closest('button, a[href], input, select, textarea, [tabindex], [contenteditable="true"], [role="button"]')) input.current?.focus();
      }}
      className={twMerge("ui-field", classNames.field)}>
      {startContent != null && <span data-slot="startContent" className={classNames.startContent}>{startContent}</span>}
      <input {...inputProps} ref={input} id={inputProps.id ?? id} data-slot="input" type="search" enterKeyHint={inputProps.enterKeyHint ?? "search"}
        name={queryParam} value={draft} placeholder={placeholder} list={suggestions.length ? id + "-suggestions" : undefined}
        onChange={(event) => { inputProps.onChange?.(event); setDraft(event.target.value); }}
        onCompositionStart={(event) => { setComposing(true); inputProps.onCompositionStart?.(event); }}
        onCompositionEnd={(event) => { setComposing(false); inputProps.onCompositionEnd?.(event); }}
        onKeyDown={(event) => { inputProps.onKeyDown?.(event); if (!event.defaultPrevented && event.key === "Escape" && draft && !composing && clearable && !inputProps.disabled && !inputProps.readOnly) { event.preventDefault(); event.stopPropagation(); clear(); } }}
        className={classNames.input} />
      {clearable && !!draft && !inputProps.readOnly && <Button variant="unstyled" type="button" data-slot="clear" aria-label="Clear search" disabled={inputProps.disabled} onClick={clear} className={classNames.clear}>×</Button>}
      {endContent != null && <span data-slot="endContent" className={classNames.endContent}>{endContent}</span>}
    </div>
    {!!suggestions.length && <datalist id={id + "-suggestions"}>{Array.from(new Set(suggestions)).map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist>}
  </form>;
}
