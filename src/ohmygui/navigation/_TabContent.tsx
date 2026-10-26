import type { ReactNode } from "react";

export type TabContentProps = {
  label: ReactNode;
  icon?: ReactNode;
  selectedIcon?: ReactNode;
  badge?: ReactNode;
  classNames?: Partial<Record<"icon" | "label" | "badge", string>>;
};

/** Shared visual anatomy; the owner supplies link or local-tab semantics. */
export function TabContent({ active, label, icon, selectedIcon, badge, classNames = {} }: TabContentProps & { active: boolean }) {
  const symbol = active ? selectedIcon ?? icon : icon;
  return <>
    {symbol != null && <span data-slot="icon" className={classNames.icon} aria-hidden="true">{symbol}</span>}
    <span data-slot="label" className={classNames.label}>{label}</span>
    {badge != null && <span data-slot="badge" className={classNames.badge}>{badge}</span>}
  </>;
}
