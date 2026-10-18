import { Button } from "../control/button/Button";
import { useEffect, useLayoutEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme.css";
import { materialAttributes, type Material } from "../_material";
import { useSplitPaneMotion, useSplitSidebarScroll } from "./_useSplitView";

export type NavigationPane = "sidebar" | "content" | "detail";
export type NavigationSplitViewProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children" | "content"> & {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  content?: ReactNode;
  detail?: ReactNode;
  sidebar?: ReactNode;
  /** Fill the viewport; disable for a height-constrained embedded view. */
  viewport?: boolean;
  sidebarWidth?: CSSProperties["width"];
  contentWidth?: CSSProperties["width"];
  /** Container width in pixels at which the view becomes a single-pane navigator. */
  mobileBreakpoint?: number;
  mobilePane?: NavigationPane;
  defaultMobilePane?: NavigationPane;
  onMobilePaneChange?: (pane: NavigationPane) => void;
  paneLabels?: Partial<Record<NavigationPane, string>>;
  paneProps?: Partial<Record<NavigationPane, HTMLAttributes<HTMLElement>>>;
  /** Materials belong to individual visible panes, not the whole split. */
  paneMaterials?: Partial<Record<NavigationPane, Material>>;
  /** Reuse this stable, unique key on related routes to restore sidebar scroll within this tab. */
  sidebarScrollKey?: string;
  /** Entrance/reveal motion; does not remount pane children. Respects reduced motion. */
  paneAnimation?: boolean;
  /** Change a destination key to animate an in-place content/detail update. */
  contentTransitionKey?: string | number;
  detailTransitionKey?: string | number;
  classNames?: Partial<Record<NavigationPane | "controls" | "toggle" | "paneButton", string>>;
};

export function NavigationSplitView({
  className, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = true,
  content, detail, sidebar, viewport = true, sidebarWidth, contentWidth,
  mobileBreakpoint = 760, mobilePane, defaultMobilePane, onMobilePaneChange,
  paneLabels = {}, paneProps = {}, paneMaterials = {}, sidebarScrollKey, paneAnimation = true,
  contentTransitionKey, detailTransitionKey, classNames = {}, style, onKeyDown, ...props
}: NavigationSplitViewProps) {
  const id = useId(), root = useRef<HTMLDivElement>(null);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [internalPane, setInternalPane] = useState<NavigationPane>(defaultMobilePane ?? (detail != null ? "detail" : "content"));
  const [compact, setCompact] = useState(false), [enhanced, setEnhanced] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const hasSidebar = sidebar != null, hasDetail = detail != null;
  const panes: NavigationPane[] = [...(hasSidebar ? ["sidebar" as const] : []), "content", ...(hasDetail ? ["detail" as const] : [])];
  const requested = mobilePane ?? internalPane;
  const selected = panes.includes(requested) ? requested : "content";
  const labels = { sidebar: "Sidebar", content: "Content", detail: "Detail", ...paneLabels };

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const measure = () => setCompact(element.getBoundingClientRect().width <= Math.max(0, mobileBreakpoint));
    measure(); setEnhanced(true);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mobileBreakpoint]);

  useSplitSidebarScroll(root, sidebarScrollKey, hasSidebar);
  useSplitPaneMotion(root, enhanced, compact, selected, hasDetail, paneAnimation, contentTransitionKey, detailTransitionKey);

  // Never leave focus inside a pane hidden by a breakpoint or a controlled prop.
  useEffect(() => {
    const element = root.current, focused = document.activeElement as HTMLElement | null;
    if (!element || !focused || !element.contains(focused)) return;
    const hiddenPane = focused.closest<HTMLElement>("[data-split-pane][inert]");
    if (hiddenPane) {
      const control = element.querySelector<HTMLButtonElement>(compact ? ':scope > [data-slot="controls"] > [data-slot="paneButton"][aria-pressed="true"]' : ':scope > [data-slot="controls"] > [data-slot="toggle"]');
      (control ?? element).focus();
    }
  }, [compact, isCollapsed, selected]);

  const select = (next: NavigationPane) => { if (mobilePane === undefined) setInternalPane(next); onMobilePaneChange?.(next); };
  const toggle = () => { if (collapsed === undefined) setInternalCollapsed(!isCollapsed); onCollapsedChange?.(!isCollapsed); };
  const pane = (name: NavigationPane, children: ReactNode) => {
    const Component = name === "sidebar" ? "aside" : "section";
    const attributes = paneProps[name];
    const hidden = compact ? selected !== name : name === "sidebar" && isCollapsed;
    const material = paneMaterials[name] ?? false;
    const appearance = materialAttributes(material);
    return <Component
      aria-label={labels[name]} tabIndex={0} {...attributes}
      {...appearance} style={{ ...appearance.style, ...attributes?.style }}
      id={attributes?.id ?? id + "-" + name} data-slot={name} data-split-pane="" data-active={!hidden}
      inert={hidden || undefined} aria-hidden={hidden || undefined}
      className={twMerge("ui-split-pane", material !== false && "ui-material", classNames[name], attributes?.className)}
    >{children}</Component>;
  };
  return <div
    {...props} ref={root} tabIndex={props.tabIndex ?? -1} data-ui="NavigationSplitView" data-enhanced={enhanced || undefined}
    data-compact={compact} data-collapsed={isCollapsed} data-sidebar={hasSidebar}
    data-viewport={viewport} data-detail={hasDetail} data-collapsible={hasSidebar && collapsible}
    onKeyDown={(event) => {
      onKeyDown?.(event);
      if (!event.defaultPrevented && event.key === "Escape" && compact && selected !== "content" && (event.target as HTMLElement).closest('[data-ui="NavigationSplitView"]') === event.currentTarget) {
        event.preventDefault(); select("content");
      }
    }}
    style={{
      ...(sidebarWidth !== undefined && { "--ui-sidebar-width": typeof sidebarWidth === "number" ? sidebarWidth + "px" : sidebarWidth }),
      ...(contentWidth !== undefined && { "--ui-content-width": typeof contentWidth === "number" ? contentWidth + "px" : contentWidth }),
      ...style,
    } as CSSProperties}
    className={twMerge("ui-split-view", className)}
  >
    <div data-slot="controls" role="group" aria-label="Workspace panes" className={twMerge("ui-split-controls", classNames.controls)}>
      {hasSidebar && collapsible && <Button variant="unstyled" type="button" data-slot="toggle" className={classNames.toggle}
        data-floating={isCollapsed} aria-label={`${isCollapsed ? "Show" : "Hide"} ${labels.sidebar}`}
        title={`${isCollapsed ? "Show" : "Hide"} ${labels.sidebar}`}
        aria-controls={paneProps.sidebar?.id ?? id + "-sidebar"} aria-expanded={!isCollapsed}
        onClick={toggle}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {isCollapsed ? <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16m4-11 3 3-3 3" /></> : <path d="m7 7 10 10M17 7 7 17" />}
        </svg>
      </Button>}
      {panes.map((name) => <Button variant="unstyled" key={name} type="button" data-slot="paneButton" className={classNames.paneButton}
        aria-controls={paneProps[name]?.id ?? id + "-" + name} aria-pressed={selected === name}
        onClick={() => select(name)}>{labels[name]}</Button>)}
    </div>
    {hasSidebar && pane("sidebar", sidebar)}
    {pane("content", content)}
    {hasDetail && pane("detail", detail)}
  </div>;
}
