import { Button } from "../control/button/Button";
import { Children, Fragment, isValidElement, useEffect, useLayoutEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import type { UIProps } from "../_types";
import "../theme.css";
import { materialAttributes, type Material } from "../_material";
import { useSplitPaneMotion, useSplitSidebarScroll } from "./_useSplitView";
import { useSplitMenu } from "./_useSplitMenu";

export type NavigationPane = "sidebar" | "content" | "detail";
export type NavigationSplitPaneProps = UIProps & HTMLAttributes<HTMLElement> & {
  label?: string;
  width?: CSSProperties["width"];
  material?: Material;
  transitionKey?: string | number;
};

function SideBar(_props: NavigationSplitPaneProps) { return null; }
function Content(_props: NavigationSplitPaneProps) { return null; }
function Detail(_props: NavigationSplitPaneProps) { return null; }

function collectPanes(children: ReactNode, result: Partial<Record<NavigationPane, NavigationSplitPaneProps>> = {}) {
  Children.forEach(children, child => {
    if (child == null || typeof child === "boolean") return;
    if (!isValidElement<NavigationSplitPaneProps>(child)) throw new Error("NavigationSplitView expects SideBar, Content or Detail children.");
    if (child.type === Fragment) { collectPanes(child.props.children, result); return; }
    const name = child.type === SideBar ? "sidebar" : child.type === Content ? "content" : child.type === Detail ? "detail" : null;
    if (!name) throw new Error("NavigationSplitView expects SideBar, Content or Detail children.");
    if (result[name]) throw new Error(`NavigationSplitView accepts only one ${name} pane.`);
    result[name] = child.props;
  });
  return result;
}

export type NavigationSplitViewProps = UIProps & Omit<ComponentPropsWithoutRef<"div">, "children" | "content"> & {
  children?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  content?: ReactNode;
  detail?: ReactNode;
  sidebar?: ReactNode;
  /** Opt into viewport height. By default the view fills its containing block. */
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
  /** Pane entrances and mobile menu entry/exit; preserves children and respects reduced motion. */
  paneAnimation?: boolean;
  /** Change a destination key to animate an in-place content/detail update. */
  contentTransitionKey?: string | number;
  detailTransitionKey?: string | number;
  classNames?: Partial<Record<NavigationPane | "controls" | "toggle" | "paneButton" | "menuHeader" | "menuClose", string>>;
};

function NavigationSplitViewRoot({
  className, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = true,
  content, detail, sidebar, children, viewport = false, sidebarWidth, contentWidth,
  mobileBreakpoint = 760, mobilePane, defaultMobilePane, onMobilePaneChange,
  paneLabels = {}, paneProps = {}, paneMaterials = {}, sidebarScrollKey, paneAnimation = true,
  contentTransitionKey, detailTransitionKey, classNames = {}, style, onKeyDown, ...props
}: NavigationSplitViewProps) {
  const slots = collectPanes(children);
  const slotAttributes: typeof paneProps = {};
  for (const name of ["sidebar", "content", "detail"] as const) {
    const slot = slots[name];
    if (!slot) continue;
    const { children: body, label, width, material, transitionKey, ...attributes } = slot;
    slotAttributes[name] = attributes;
    if (name === "sidebar") { sidebar = body; sidebarWidth = width ?? sidebarWidth; }
    if (name === "content") { content = body; contentWidth = width ?? contentWidth; contentTransitionKey = transitionKey ?? contentTransitionKey; }
    if (name === "detail") { detail = body; detailTransitionKey = transitionKey ?? detailTransitionKey; }
    paneLabels = { ...paneLabels, ...(label !== undefined && { [name]: label }) };
    paneMaterials = { ...paneMaterials, ...(material !== undefined && { [name]: material }) };
  }
  paneProps = { ...paneProps };
  for (const name of ["sidebar", "content", "detail"] as const) {
    if (slotAttributes[name]) paneProps[name] = { ...paneProps[name], ...slotAttributes[name] };
  }
  const id = useId(), root = useRef<HTMLDivElement>(null);
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [internalPane, setInternalPane] = useState<NavigationPane>(defaultMobilePane ?? (detail != null ? "detail" : "content"));
  const [compact, setCompact] = useState(false), [enhanced, setEnhanced] = useState(false);
  const isCollapsed = collapsed ?? internalCollapsed;
  const hasSidebar = slots.sidebar != null || sidebar != null, hasDetail = slots.detail != null || detail != null;
  const panes: NavigationPane[] = [...(hasSidebar ? ["sidebar" as const] : []), "content", ...(hasDetail ? ["detail" as const] : [])];
  const requested = mobilePane ?? internalPane;
  const selected = panes.includes(requested) ? requested : "content";
  const labels = { sidebar: "Sidebar", content: "Content", detail: "Detail", ...paneLabels };
  const lastPane = useRef<"content" | "detail">(hasDetail ? "detail" : "content");
  useLayoutEffect(() => { if (selected !== "sidebar") lastPane.current = selected; }, [selected]);
  const displayedPane = selected === "sidebar" ? lastPane.current === "detail" && !hasDetail ? "content" : lastPane.current : selected;
  const select = (next: NavigationPane) => { if (mobilePane === undefined) setInternalPane(next); onMobilePaneChange?.(next); };
  const closeMenu = () => select(displayedPane);
  const menuOpen = compact && hasSidebar && selected === "sidebar";
  const menuPresent = useSplitMenu(root, compact, menuOpen, paneAnimation, closeMenu);

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
  useSplitPaneMotion(root, enhanced, compact, displayedPane, hasDetail, paneAnimation, contentTransitionKey, detailTransitionKey);

  // Never leave focus inside a pane hidden by a breakpoint or a controlled prop.
  useEffect(() => {
    const element = root.current, focused = document.activeElement as HTMLElement | null;
    if (!element || !focused || !element.contains(focused)) return;
    const hiddenPane = focused.closest<HTMLElement>("[data-split-pane][inert]");
    if (hiddenPane) {
      const control = element.querySelector<HTMLButtonElement>(menuOpen ? ':scope > [data-slot="sidebar"] > [data-slot="menuHeader"] > [data-slot="menuClose"]' : compact ? ':scope > [data-slot="controls"] > [data-slot="paneButton"][aria-pressed="true"], :scope > [data-slot="controls"] > [data-pane="sidebar"]' : ':scope > [data-slot="controls"] > [data-slot="toggle"]');
      (control ?? element).focus();
    }
  }, [compact, isCollapsed, selected]);

  const toggle = () => { if (collapsed === undefined) setInternalCollapsed(!isCollapsed); onCollapsedChange?.(!isCollapsed); };
  const pane = (name: NavigationPane, children: ReactNode) => {
    const Component = name === "sidebar" ? "aside" : "section";
    const attributes = paneProps[name];
    const visible = compact ? name === "sidebar" ? menuPresent : displayedPane === name : name !== "sidebar" || !isCollapsed;
    const hidden = !visible || (compact && (name === "sidebar" ? !menuOpen : menuOpen));
    const material = paneMaterials[name] ?? false;
    const appearance = materialAttributes(material);
    return <Component
      aria-label={labels[name]} tabIndex={0} {...attributes}
      {...appearance} style={{ ...appearance.style, ...attributes?.style }}
      id={attributes?.id ?? id + "-" + name} data-slot={name} data-split-pane="" data-active={visible}
      data-mobile-menu={name === "sidebar" && menuPresent || undefined}
      role={name === "sidebar" && menuPresent ? "dialog" : attributes?.role}
      aria-modal={attributes?.["aria-modal"]}
      inert={hidden || undefined} aria-hidden={hidden || undefined}
      onClick={(event) => {
        attributes?.onClick?.(event);
        if (name !== "sidebar" || !menuOpen || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = event.target instanceof Element ? event.target : null;
        const link = target?.closest<HTMLAnchorElement>("a[href]");
        if (link && !link.hasAttribute("download") && (!link.target || link.target === "_self") && target?.closest('[data-ui="NavigationSplitView"]') === root.current) closeMenu();
      }}
      className={twMerge("ui-split-pane", material !== false && "ui-material", classNames[name], attributes?.className)}
    >{name === "sidebar" && <div data-slot="menuHeader" className={twMerge("ui-split-menu-header", classNames.menuHeader)}>
      <span>{labels.sidebar}</span>
      <Button variant="unstyled" type="button" data-slot="menuClose" className={classNames.menuClose}
        aria-label={`Close ${labels.sidebar}`} onClick={closeMenu}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </Button>
    </div>}{children}</Component>;
  };
  return <div
    {...props} ref={root} tabIndex={props.tabIndex ?? -1} data-ui="NavigationSplitView" data-enhanced={enhanced || undefined}
    data-compact={compact} data-collapsed={isCollapsed} data-sidebar={hasSidebar}
    data-viewport={viewport} data-detail={hasDetail} data-collapsible={hasSidebar && collapsible}
    onKeyDown={(event) => {
      onKeyDown?.(event);
      const dialog = (event.target as HTMLElement).closest("dialog:modal");
      if (!event.defaultPrevented && event.key === "Escape" && compact && selected !== "content" && (!dialog || dialog.contains(event.currentTarget)) && (event.target as HTMLElement).closest('[data-ui="NavigationSplitView"]') === event.currentTarget) {
        event.preventDefault(); event.stopPropagation(); if (menuOpen) closeMenu(); else select("content");
      }
    }}
    style={{
      ...(sidebarWidth !== undefined && { "--ui-sidebar-width": typeof sidebarWidth === "number" ? sidebarWidth + "px" : sidebarWidth }),
      ...(contentWidth !== undefined && { "--ui-content-width": typeof contentWidth === "number" ? contentWidth + "px" : contentWidth }),
      ...style,
    } as CSSProperties}
    className={twMerge("ui-split-view", className)}
  >
    <div data-slot="controls" role="group" aria-label="Workspace panes" inert={menuOpen || undefined} className={twMerge("ui-split-controls", classNames.controls)}>
      {hasSidebar && collapsible && <Button variant="unstyled" type="button" data-slot="toggle" className={classNames.toggle}
        data-floating={isCollapsed} aria-label={`${isCollapsed ? "Show" : "Hide"} ${labels.sidebar}`}
        title={`${isCollapsed ? "Show" : "Hide"} ${labels.sidebar}`}
        aria-controls={paneProps.sidebar?.id ?? id + "-sidebar"} aria-expanded={!isCollapsed}
        onClick={toggle}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          {isCollapsed ? <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16m4-11 3 3-3 3" /></> : <path d="m7 7 10 10M17 7 7 17" />}
        </svg>
      </Button>}
      {panes.filter(name => name === "sidebar" || hasDetail).map((name) => <Button variant="unstyled" key={name} type="button" data-slot="paneButton" data-pane={name} className={classNames.paneButton}
        aria-controls={paneProps[name]?.id ?? id + "-" + name} aria-pressed={name === "sidebar" ? undefined : displayedPane === name}
        aria-expanded={name === "sidebar" ? menuOpen : undefined} aria-haspopup={name === "sidebar" ? "dialog" : undefined}
        onClick={() => select(name)}>{name === "sidebar" && <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}{labels[name]}</Button>)}
    </div>
    {hasSidebar && pane("sidebar", sidebar)}
    {pane("content", content)}
    {hasDetail && pane("detail", detail)}
  </div>;
}

export const NavigationSplitView = Object.assign(NavigationSplitViewRoot, { SideBar, Content, Detail });
