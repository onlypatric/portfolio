import { Button } from "../control/button/Button";
import "../theme.css";
import { useLayoutEffect, useId, useRef, useSyncExternalStore, type ComponentPropsWithoutRef, type ReactNode, type RefObject } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps, UIStyle } from "../_types";
import { materialAttributes, type Material, type MaterialProps } from "../_material";
import { animateModal, modalSnapshot, modalTriggerRect } from "./_modal-motion";

export type ModalSurfaceProps = UIProps & MaterialProps & Omit<ComponentPropsWithoutRef<"dialog">, "title" | "onClose" | "children"> & {
  /** Shared native-dialog backdrop, never a filter on modal content. false opts out of blur. */
  backdropMaterial?: Material;
  /** Explicit opener for motion/focus return; otherwise use the previously focused element. */
  triggerRef?: RefObject<HTMLElement | null>;
  /** Expand/travel from the opener on open. Reduced motion always skips it. */
  openingAnimation?: boolean;
  /** Return to the opener before releasing the native modal. Keep this component mounted. */
  closingAnimation?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
  classNames?: Partial<Record<"header" | "title" | "description" | "body" | "footer" | "close", string>>;
  description?: ReactNode;
  dismissable?: boolean;
  onClose?: () => void;
  placement?: "bottom" | "center" | "end";
  size?: "sm" | "md" | "lg" | "full";
  title?: ReactNode;
};

let locks = 0;
let originalOverflow = "";
const modals = new Set<HTMLDialogElement>();
function updateBackdrops() {
  const top = Array.from(modals).at(-1);
  modals.forEach(dialog => dialog.toggleAttribute("data-under-modal", dialog !== top));
}
const subscribeToClient = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ModalSurface({
  actions, children, className, classNames = {}, description, dismissable = true, onClose,
  open = false, placement = "center", size = "md", title, material = false, backdropMaterial, style, triggerRef, openingAnimation = true, closingAnimation = true, ...props
}: ModalSurfaceProps) {
  const surface = materialAttributes(material, { tint: "var(--overlay)" });
  const backdrop = materialAttributes(backdropMaterial ?? (material === false), { blur: "3px", opacity: .45, tint: "#000" });
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const motion = useRef<() => void>(() => {});
  const session = useRef<{ previous: HTMLElement | null; focused?: HTMLElement | null } | null>(null);
  const options = useRef({ triggerRef, openingAnimation, closingAnimation, inert: props.inert }); options.current = { triggerRef, openingAnimation, closingAnimation, inert: props.inert };
  const release = () => {
    const dialog = ref.current, active = session.current;
    if (!dialog || !active) return;
    session.current = null;
    dialog.close(); dialog.inert = options.current.inert ?? false;
    delete dialog.dataset.closing;
    modals.delete(dialog); dialog.removeAttribute("data-under-modal"); updateBackdrops();
    if (--locks === 0) document.body.style.overflow = originalOverflow;
    if (active.previous?.isConnected) active.previous.focus({ preventScroll: true });
  };
  // Hydration starts with server markup; fresh client mounts are imperative immediately.
  const enhanced = useSyncExternalStore(subscribeToClient, clientSnapshot, serverSnapshot);
  useLayoutEffect(() => () => { motion.current(); release(); }, []);
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || !enhanced) return;
    if (!open) {
      if (!session.current) { dialog.close(); return; }
      const current = modalSnapshot(dialog);
      session.current.focused = dialog.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
      motion.current();
      dialog.inert = true;
      motion.current = animateModal(dialog, modalTriggerRect(session.current.previous), { closing: true, current, enabled: options.current.closingAnimation, complete: release });
      return;
    }
    const current = session.current ? modalSnapshot(dialog) : undefined;
    motion.current();
    dialog.inert = options.current.inert ?? false;
    if (session.current) {
      if (session.current.focused?.isConnected) session.current.focused.focus({ preventScroll: true });
      else dialog.focus({ preventScroll: true });
      motion.current = animateModal(dialog, modalTriggerRect(session.current.previous), { current, enabled: options.current.openingAnimation });
      return;
    }
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const requestedFocus = focused && dialog.contains(focused) ? focused : null;
    const explicitTrigger = options.current.triggerRef?.current;
    const previous = explicitTrigger && !dialog.contains(explicitTrigger) ? explicitTrigger : requestedFocus ? null : focused;
    // Capture before showModal moves focus or scrollbars/layout change.
    const source = modalTriggerRect(previous);
    if (!dialog.matches(":modal")) {
      if (dialog.open) dialog.close();
      dialog.showModal();
      requestedFocus?.focus();
    }
    if (locks++ === 0) { originalOverflow = document.body.style.overflow; document.body.style.overflow = "hidden"; }
    modals.add(dialog); updateBackdrops();
    session.current = { previous };
    motion.current = animateModal(dialog, source, { enabled: options.current.openingAnimation });
  }, [open, enhanced]);
  useLayoutEffect(() => {
    if (!openingAnimation && ref.current?.dataset.opening) motion.current();
    if (!closingAnimation && ref.current?.dataset.closing) { motion.current(); release(); }
  }, [openingAnimation, closingAnimation]);

  return (
    <dialog
      {...props}
      ref={ref}
      // Preserve SSR/no-JS visibility. Once hydrated, showModal owns `open` so
      // native autofocus cannot run before the trigger is captured for restore.
      open={enhanced ? undefined : open}
      data-ui={props["data-ui" as keyof typeof props] ?? "ModalSurface"}
      data-placement={placement}
      data-size={size}
      data-material={surface["data-material"]}
      data-backdrop-material={backdrop["data-material"]}
      data-backdrop-custom={typeof backdropMaterial === "object" || undefined}
      style={{ ...surface.style, "--ui-backdrop-blur": backdrop.style["--ui-material-blur"], "--ui-backdrop-opacity": backdrop.style["--ui-material-opacity"], "--ui-backdrop-tint": backdrop.style["--ui-material-tint"], ...style } as UIStyle}
      aria-labelledby={props["aria-labelledby"] ?? (title ? id + "-title" : undefined)}
      aria-describedby={props["aria-describedby"] ?? (description ? id + "-description" : undefined)}
      onCancel={(event) => { props.onCancel?.(event); event.preventDefault(); if (dismissable && !ref.current?.dataset.closing) onClose?.(); }}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented || !dismissable || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose?.();
      }}
      className={twMerge("ui-modal", material !== false && "ui-material", className)}
    >
      {(title || description || onClose) && <header data-slot="header" className={classNames.header}>
        <div>{title && <h2 id={id + "-title"} data-slot="title" className={classNames.title}>{title}</h2>}
        {description && <p id={id + "-description"} data-slot="description" className={classNames.description}>{description}</p>}</div>
        {onClose && dismissable && <Button variant="unstyled" type="button" data-slot="close" aria-label="Close" onClick={onClose} className={classNames.close}>×</Button>}
      </header>}
      <div data-slot="body" className={classNames.body}>{children}</div>
      {actions && <footer data-slot="footer" className={classNames.footer}>{actions}</footer>}
    </dialog>
  );
}
