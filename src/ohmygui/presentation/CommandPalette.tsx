import { Button } from "../control/button/Button";
import { useEffect, useId, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ModalSurface, type ModalSurfaceProps } from "./ModalSurface";
import type { PresentationCommand } from "./_types";

export type CommandPaletteProps = ModalSurfaceProps & {
  commands: PresentationCommand[];
  onOpenChange?: (open: boolean) => void;
  shortcut?: string;
  placeholder?: string;
};
export function CommandPalette({ children, commands, onClose, onOpenChange, open, placeholder = "Type a command…", shortcut = "mod+k", ...props }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false), [query, setQuery] = useState(""), [active, setActive] = useState(0);
  const id = useId();
  const currentOpen = open ?? internalOpen;
  const change = (next: boolean) => { if (open === undefined) setInternalOpen(next); onOpenChange?.(next); if (!next) onClose?.(); };
  const filtered = useMemo(() => commands.filter((command) => (command.label + " " + (command.keywords ?? []).join(" ")).toLowerCase().includes(query.toLowerCase())), [commands, query]);
  const run = (index: number) => { const command = filtered[index]; if (command) { command.onSelect?.(); change(false); } };
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const keys = shortcut.toLowerCase().replace("⌘", "mod+").split("+"), key = keys.pop();
      const modifier = keys.includes("mod") ? (event.metaKey || event.ctrlKey) : (!keys.includes("meta") || event.metaKey) && (!keys.includes("ctrl") || event.ctrlKey);
      if (event.key.toLowerCase() === key && modifier && (!keys.includes("shift") || event.shiftKey) && (!keys.includes("alt") || event.altKey)) { event.preventDefault(); change(!currentOpen); }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [currentOpen, onClose, onOpenChange, shortcut, open]);
  return <ModalSurface data-ui="CommandPalette" title="Command palette" description={"Shortcut: " + shortcut} {...props} open={currentOpen} onClose={() => change(false)}>
    <div className="grid gap-[var(--ui-space-3)]">{children}
      <input data-slot="input" autoFocus type="search" role="combobox" aria-label="Search commands" aria-autocomplete="list" aria-expanded={currentOpen} aria-controls={id} aria-activedescendant={filtered[active] ? id + "-" + active : undefined}
        value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder={placeholder}
        onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); run(active); } else if (filtered.length && ["ArrowDown", "ArrowUp"].includes(event.key)) { event.preventDefault(); setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length); } }}
        className="ui-field" />
      <div data-slot="results" id={id} role="listbox" aria-label="Commands" className="grid gap-[var(--ui-space-1)]">
        {filtered.map((command, index) => <Button variant="unstyled" type="button" id={id + "-" + index} key={command.id} role="option" tabIndex={-1} aria-selected={active === index} onMouseEnter={() => setActive(index)} onClick={() => run(index)} className={twMerge("rounded-[var(--field-radius)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-start text-[length:var(--ui-font-size-sm)]", active === index && "bg-[var(--ui-selection)]")}>{command.label}</Button>)}
        {!filtered.length && <p role="status" className="p-[var(--ui-space-3)] text-[var(--muted)]">No commands found.</p>}
      </div>
    </div>
  </ModalSurface>;
}
