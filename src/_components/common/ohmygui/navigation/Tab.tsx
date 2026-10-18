import { Button } from "../control/button/Button";
import type { UIProps } from "../_types";
import "../theme.css";
import { useEffect, useRef, type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";
import { TabContent, type TabContentProps } from "./_TabContent";
import { attachTabIndicator } from "./_tabIndicator";

export type TabProps = UIProps & Omit<ComponentPropsWithRef<"button">, "children"> & TabContentProps & {
  active?: boolean;
  id: string;
};

export function Tab({ active = false, className, classNames, id, label, icon, selectedIcon, badge, ref, ...props }: TabProps) {
  const button = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const list = button.current?.closest<HTMLElement>('[role="tablist"]');
    if (list) return attachTabIndicator(list);
  }, []);
  return (
    <Button variant="unstyled" data-ui="Tab"
      {...props}
      ref={element => { button.current = element; if (typeof ref === "function") return ref(element); else if (ref) ref.current = element; }}
      id={id}
      type={props.type ?? "button"}
      role="tab"
      aria-selected={active}
      data-has-icon={(active ? selectedIcon ?? icon : icon) != null}
      tabIndex={props.disabled ? -1 : props.tabIndex ?? (active ? 0 : -1)}
      className={twMerge(
        "ui-tab",
        className,
      )}
    >
      <TabContent active={active} label={label} icon={icon} selectedIcon={selectedIcon} badge={badge} classNames={classNames} />
    </Button>
  );
}
