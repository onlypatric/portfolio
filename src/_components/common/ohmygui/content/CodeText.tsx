import type { UIProps } from "../_types";
import "../theme.css";
import { Children, type ComponentPropsWithRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type CodeTextProps = UIProps & ComponentPropsWithRef<"code"> & {
  children?: ReactNode;
  inline?: boolean;
  mode?: "snippet" | "full";
  /** Top-right controls, separate from selectable code. Accepts multiple buttons/groups. */
  actions?: ReactNode;
  actionsLabel?: string;
  filename?: string;
  classNames?: Partial<Record<"root" | "header" | "label" | "actions" | "body" | "code", string>>;
  /** Compatibility slot; actions takes precedence when explicitly supplied. */
  copyButton?: ReactNode;
  language?: string;
  wrap?: boolean;
};

export function CodeText({
  children,
  className,
  inline = false,
  mode,
  actions,
  actionsLabel = "Code actions",
  filename,
  classNames = {},
  copyButton,
  language,
  wrap = false,
  ...props
}: CodeTextProps) {
  const resolvedMode = mode ?? (inline ? "snippet" : "full");
  const snippet = resolvedMode === "snippet";
  const controls = actions !== undefined ? actions : copyButton;
  const hasActions = Children.toArray(controls).length > 0;
  const legacyCopy = actions === undefined && hasActions;
  const Actions = snippet ? "span" : "div";
  const actionSection = hasActions && <Actions data-slot="actions" role="group" aria-label={actionsLabel} className={twMerge("ui-code-actions", classNames.actions)}>
    {legacyCopy ? <span data-slot="copyButton">{copyButton}</span> : controls}
  </Actions>;
  const code = (
    <code data-ui="CodeText"
      {...props}
      data-language={language}
      data-mode={resolvedMode}
      data-wrap={wrap || undefined}
      className={twMerge("ui-code-content", snippet && "ui-code-snippet", classNames.code, className)}
    >
      {children}
    </code>
  );

  if (snippet) return hasActions ? <span data-ui="CodeTextContainer" data-mode="snippet" className={twMerge("ui-code-text", classNames.root)}>
    {code}{actionSection}
  </span> : code;

  return <div data-ui="CodeTextContainer" data-mode="full" className={twMerge("ui-code-text", classNames.root)}>
    {(filename || language || hasActions) && <div data-slot="header" className={twMerge("ui-code-header", classNames.header)}>
      {(filename || language) && <div data-slot="label" className={twMerge("ui-code-label", classNames.label)}>
        {filename && <span data-slot="filename" title={filename}>{filename}</span>}
        {language && <span data-slot="language">{language}</span>}
      </div>}
      {actionSection}
    </div>}
    <pre data-ui="CodeTextBlock" data-slot="body" data-mode="full" tabIndex={0} role="region" aria-label={filename ? `${filename} source code` : language ? `${language} source code` : "Source code"} className={twMerge("ui-code-body", classNames.body)}>{code}</pre>
  </div>;
}
