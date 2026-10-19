import type { UIProps } from "../../_types";
import clsx from "clsx";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import "../../theme.css";

const variantMap = {
  unstyled: "",
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--ui-shadow-sm)] hover:opacity-90 hover:shadow-[var(--ui-shadow-md)]",
  secondary:
    "bg-[var(--default)] text-[var(--default-foreground)] shadow-[var(--ui-shadow-sm)] hover:opacity-90 hover:shadow-[var(--ui-shadow-md)]",
  ghost: "text-[var(--foreground)] hover:bg-[var(--default)]",
  danger: "bg-[var(--danger)] text-[var(--danger-foreground)] hover:opacity-90",
  outline: "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--ui-hover)]",
} as const;

const feedbackColorMap = {
  unstyled: "currentColor",
  primary: "var(--accent-foreground)",
  secondary: "var(--default-foreground)",
  ghost: "var(--foreground)",
  danger: "var(--danger-foreground)",
  outline: "var(--foreground)",
} as const;

const sizeMap = {
  sm: "min-h-[var(--ui-control-height-sm)] px-[var(--ui-space-3)] text-[length:var(--ui-font-size-sm)]",
  md: "min-h-[var(--ui-control-height)] px-[var(--ui-space-4)] text-[length:var(--ui-font-size-sm)]",
  lg: "min-h-[var(--ui-control-height-lg)] px-[var(--ui-space-5)] text-[length:var(--ui-font-size-base)]",
} as const;

const radiusMap = {
  none: "rounded-none",
  xs: "rounded-[calc(var(--radius)*0.25)]",
  sm: "rounded-[calc(var(--radius)*0.5)]",
  md: "rounded-[var(--radius)]",
  lg: "rounded-[calc(var(--radius)*1.5)]",
  xl: "rounded-[calc(var(--radius)*2)]",
  full: "rounded-[calc(var(--radius)*100)]",
} as const;

export type ButtonPressEvent =
  | MouseEvent<HTMLButtonElement>
  | PointerEvent<HTMLButtonElement>;

export type ButtonProps = UIProps & ComponentPropsWithRef<"button"> & {
  iconOnly?: boolean;
  loading?: boolean;
  pending?: boolean;
  longPress?: number;
  onPress?: (event: ButtonPressEvent) => void | Promise<void>;
  onPressError?: (error: unknown) => void | Promise<void>;
  radius?: keyof typeof radiusMap;
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
};

export function Button({
  children,
  className,
  disabled = false,
  iconOnly = false,
  loading: controlledLoading,
  pending = false,
  onClick,
  onPointerCancel,
  onPointerLeave,
  onPointerUp,
  onPress,
  onPressError,
  onPointerDown,
  longPress,
  radius = "md",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = !!(controlledLoading || pending || internalLoading);
  const [pressError, setPressError] = useState(false);
  const errorId = useId();
  const [longPressFill, setLongPressFill] = useState<
    "idle" | "filling" | "complete"
  >("idle");
  const [ripple, setRipple] = useState<{
    id: number;
    size: number;
    x: number;
    y: number;
  } | null>(null);
  const pressingRef = useRef(false);
  const longPressTimerRef = useRef<number | null>(null);
  const rippleIdRef = useRef(0);
  const generation = useRef(0);
  const pendingFocus = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    if (loading || !pendingFocus.current) return;
    const owner = pendingFocus.current; pendingFocus.current = null;
    if (owner.isConnected && !owner.disabled && document.activeElement === document.body) owner.focus();
  });
  useEffect(() => () => {
    generation.current++;
    if (longPressTimerRef.current !== null) window.clearTimeout(longPressTimerRef.current);
  }, []);
  useEffect(() => { if (disabled || loading) cancelLongPress(); }, [disabled, loading]);
  useEffect(() => { cancelLongPress(); }, [longPress]);

  const longPressDuration = Number.isFinite(longPress)
    ? Math.max(0, longPress as number)
    : 0;

  async function runPress(event: ButtonPressEvent) {
    if (!onPress || disabled || loading || pressingRef.current) {
      return;
    }

    pressingRef.current = true;
    setPressError(false);
    const version = generation.current;
    const owner = event.currentTarget, wasFocused = document.activeElement === owner;

    try {
      const result = onPress(event);
      if (result && typeof result.then === "function") { if (wasFocused) pendingFocus.current = owner; setInternalLoading(true); await result; }
    } catch (error) {
      if (version === generation.current) {
        try { if (onPressError) await onPressError(error); else setPressError(true); }
        catch { if (version === generation.current) setPressError(true); }
      }
    } finally {
      if (version === generation.current) {
        pressingRef.current = false;
        setInternalLoading(false);
        if (longPress !== undefined) {
          setLongPressFill("idle");
        }
      }
    }
  }

  function cancelLongPress() {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      setLongPressFill("idle");
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    onPointerDown?.(event);

    if (event.defaultPrevented || event.button !== 0 || event.currentTarget.matches(":disabled") || disabled || loading || pressingRef.current) {
      return;
    }

    if (longPress !== undefined) {
      cancelLongPress();
      setLongPressFill("filling");
      // React clears currentTarget after dispatch; the delayed callback needs its owner.
      const pressEvent = { ...event, currentTarget: event.currentTarget };
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTimerRef.current = null;
        setLongPressFill("complete");
        if (!pressEvent.currentTarget.matches(":disabled") && pressEvent.currentTarget.isConnected) void runPress(pressEvent);
      }, longPressDuration);
      return;
    }

    startRipple(event.currentTarget, event.clientX, event.clientY);
  }

  function startRipple(button: HTMLButtonElement, clientX?: number, clientY?: number) {
    const bounds = button.getBoundingClientRect();
    const x = clientX === undefined ? bounds.width / 2 : clientX - bounds.left;
    const y = clientY === undefined ? bounds.height / 2 : clientY - bounds.top;
    const distanceX = Math.max(x, bounds.width - x);
    const distanceY = Math.max(y, bounds.height - y);
    const id = rippleIdRef.current + 1;

    rippleIdRef.current = id;
    setRipple({
      id,
      size: Math.hypot(distanceX, distanceY) * 2,
      x,
      y,
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    onPointerUp?.(event);
    cancelLongPress();
  }

  function handlePointerLeave(event: PointerEvent<HTMLButtonElement>) {
    onPointerLeave?.(event);
    cancelLongPress();
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    onPointerCancel?.(event);
    cancelLongPress();
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled || loading || pressingRef.current || event.currentTarget.matches(":disabled")) { event.preventDefault(); return; }
    // Pointer actions opt into holding. Keyboard/assistive activation stays native.
    if (longPress !== undefined && event.detail !== 0) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    // Enter/Space, assistive activation and button.click() have no pointerdown.
    if (event.detail === 0 && !disabled && !loading) startRipple(event.currentTarget);

    void runPress(event);
  }

  return (
    <button data-ui="Button"
      {...props}
      data-ui-button=""
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-describedby={[props["aria-describedby"], pressError ? errorId : undefined].filter(Boolean).join(" ") || undefined}
      data-press-error={pressError || undefined}
      data-loading={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-icon-only={iconOnly || undefined}
      onClick={handleClick}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      className={twMerge(
        clsx(
          "relative isolate overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] disabled:pointer-events-none disabled:opacity-50",
          variant !== "unstyled" && "inline-flex min-w-0 items-center justify-center gap-[var(--ui-space-2)] select-none font-medium transition-[background-color,box-shadow,opacity] duration-[var(--ui-duration-fast)] ease-out",
          iconOnly && "aspect-square px-0",
          variant !== "unstyled" && radiusMap[radius],
          variant !== "unstyled" && sizeMap[size],
          variantMap[variant],
          className
        )
      )}
    >
      {loading && <span data-slot="spinner" aria-hidden="true" className="relative z-10" />}
      {variant === "unstyled" ? children : <span data-slot="label" className="relative z-10 inline-flex min-w-0 items-center gap-[inherit] break-words [&>svg]:shrink-0">{children}</span>}
      {pressError && <span id={errorId} role="alert" className="sr-only">Action failed. Please try again.</span>}
      {longPress !== undefined ? (
        <span
          aria-hidden="true"
          data-slot="longPress"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: feedbackColorMap[variant],
            opacity: 0.2,
            transition: `transform ${longPressFill === "filling" ? longPressDuration : 150}ms ${longPressFill === "filling" ? "linear" : "ease-out"}`,
            transform: `scaleX(${longPressFill === "idle" ? 0 : 1})`,
            transformOrigin: "var(--ui-press-origin, left) center",
          }}
        />
      ) : ripple ? (
        <span
          key={ripple.id}
          data-slot="ripple"
          aria-hidden="true"
          className="pointer-events-none absolute z-0 rounded-full"
          onAnimationEnd={(event) => {
            if (event.animationName === "ui-button-ripple") {
              setRipple(current => current?.id === ripple.id ? null : current);
            }
          }}
          style={{
            backgroundColor: feedbackColorMap[variant],
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            animation: "ui-button-ripple 750ms cubic-bezier(0.22, 1, 0.36, 1) both",
            width: ripple.size,
          }}
        />
      ) : null}
    </button>
  );
}
