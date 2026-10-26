import "../theme.css";
import { useEffect, useId, useRef, useState } from "react";
import { Button, type ButtonProps } from "../control/button/Button";

type PasteFormat = "text" | "html";
export type PasteButtonProps = Omit<ButtonProps, "onClick" | "onPress" | "onPressError"> & {
  formats?: PasteFormat[];
  /** HTML is returned as untrusted source text, never rendered by this component. */
  onPasteEvent?: (value: string, format: PasteFormat) => void | Promise<void>;
};
export function PasteButton({ children = "Paste", formats = ["text"], onPasteEvent, ...props }: PasteButtonProps) {
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean }>();
  const version = useRef(0), feedbackId = useId();
  useEffect(() => () => { version.current++; }, []);
  async function paste() {
    const currentVersion = version.current; let received = false;
    const announce = (text: string, error = false) => { if (version.current === currentVersion) setFeedback({ text, error }); };
    setFeedback(undefined);
    const accepted = [...new Set(formats.filter(format => format === "text" || format === "html"))];
    if (!accepted.length) { announce("Choose a supported clipboard format.", true); return; }
    const clipboard = navigator.clipboard;
    if (!clipboard || (!clipboard.read && (!accepted.includes("text") || !clipboard.readText))) { announce("Clipboard reading is unavailable. Use your browser's Paste command instead.", true); return; }
    try {
      let value = "", chosen: PasteFormat = "text";
      if (accepted.length === 1 && accepted[0] === "text" && clipboard.readText) value = await clipboard.readText();
      else if (clipboard.read) {
        const items = await clipboard.read(); let match = false;
        for (const format of accepted) {
          const mime = format === "html" ? "text/html" : "text/plain";
          for (const item of items) {
            if (!item.types.includes(mime)) continue;
            value = await (await item.getType(mime)).text();
            if (value) { chosen = format; match = true; break; }
          }
          if (match) break;
        }
        if (!match) { announce("The clipboard has no content in the requested formats.", true); return; }
      } else value = await clipboard.readText();
      if (version.current !== currentVersion) return;
      if (!value) { announce("The clipboard has no content in the requested format."); return; }
      received = true; await onPasteEvent?.(value, chosen);
      announce(chosen === "html" ? "HTML source pasted." : "Text pasted.");
    } catch { announce(received ? "Unable to apply pasted content. Try again." : "Clipboard access failed. Check permission or use your browser's Paste command.", true); }
  }
  return <span data-ui="PasteButton" className="ui-action-flow">
    <Button {...props} type="button" data-formats={formats.join(",")} aria-describedby={[props["aria-describedby"], feedback ? feedbackId : undefined].filter(Boolean).join(" ") || undefined} onPress={paste}>{children}</Button>
    {feedback && <span id={feedbackId} role={feedback.error ? "alert" : "status"} data-error={feedback.error || undefined} className="ui-action-feedback">{feedback.text}</span>}
  </span>;
}
