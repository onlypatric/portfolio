import "../theme.css";
import { useEffect, useId, useRef, useState } from "react";
import { Button, type ButtonProps } from "../control/button/Button";
import { TextField } from "./TextField";

export type ShareLinkProps = Omit<ButtonProps, "onClick" | "onPress" | "onPressError"> & { files?: File[]; text?: string; title?: string; url?: string };
export function ShareLink({ children = "Share", files, text, title, url, ...props }: ShareLinkProps) {
  const [feedback, setFeedback] = useState<{ text: string; error?: boolean }>(), [fallback, setFallback] = useState<{ value: string; link: boolean; copy: boolean }>();
  const version = useRef(0), feedbackId = useId();
  useEffect(() => () => { version.current++; }, []);
  async function share() {
    const currentVersion = version.current;
    const announce = (message: string, error = false) => { if (version.current === currentVersion) setFeedback({ text: message, error }); };
    setFeedback(undefined); setFallback(undefined);
    let resolvedUrl: string | undefined;
    if (url !== undefined) {
      try {
        const parsed = new URL(url, document.baseURI);
        if (["javascript:", "file:", "data:", "blob:", "ws:", "wss:", "about:"].includes(parsed.protocol)) throw new Error();
        resolvedUrl = parsed.href;
      } catch { announce("This link cannot be shared. Provide a valid shareable URL.", true); return; }
    }
    const data: ShareData = { ...(title !== undefined ? { title } : {}), ...(text !== undefined ? { text } : {}), ...(resolvedUrl ? { url: resolvedUrl } : {}), ...(files?.length ? { files } : {}) };
    if (!Object.keys(data).length) { announce("Provide a link, text, title or files to share.", true); return; }
    const offerFallback = (message: string) => {
      const value = resolvedUrl ?? text;
      if (!value) { announce(files?.length ? "These files cannot be shared here, and no link or text is available to copy." : "Sharing is unavailable. Add a link or text to offer a copy fallback."); return; }
      announce(files?.length && !message.includes("not files") ? message + " Copying includes only the link or text, not files." : message);
      if (value && version.current === currentVersion) setFallback({ value, link: !!resolvedUrl, copy: typeof navigator.clipboard?.writeText === "function" });
    };
    try {
      if (!navigator.share || (navigator.canShare && !navigator.canShare(data)) || (files?.length && !navigator.canShare)) {
        offerFallback(files?.length ? "These files cannot be shared here. A copy fallback includes only the link or text, not files." : "Sharing is unavailable here. You can copy the link or text instead."); return;
      }
      // No await before share: preserve the click's transient user activation.
      await navigator.share(data); announce("Shared.");
    } catch (error) {
      if (version.current !== currentVersion) return;
      if (error && typeof error === "object" && "name" in error && error.name === "AbortError") { announce("Sharing cancelled."); return; }
      offerFallback("Unable to share. You can copy the link or text instead.");
    }
  }
  async function copy() {
    if (!fallback) return;
    const currentVersion = version.current;
    try { await navigator.clipboard.writeText(fallback.value); if (version.current === currentVersion) setFeedback({ text: fallback.link ? "Link copied." : "Text copied." }); }
    catch { if (version.current === currentVersion) setFeedback({ text: "Copy failed. Select the value below and copy it manually.", error: true }); }
  }
  return <div data-ui="ShareLink" className="ui-action-flow">
    <Button {...props} type="button" aria-describedby={[props["aria-describedby"], feedback ? feedbackId : undefined].filter(Boolean).join(" ") || undefined} onPress={share}>{children}</Button>
    {feedback && <span id={feedbackId} role={feedback.error ? "alert" : "status"} data-error={feedback.error || undefined} className="ui-action-feedback">{feedback.text}</span>}
    {fallback && <div data-slot="fallback" className="ui-share-fallback">
      <TextField label={fallback.link ? "Shareable link" : "Shareable text"} value={fallback.value} readOnly onFocus={event => event.currentTarget.select()} />
      {fallback.copy && <Button type="button" size="sm" variant="outline" disabled={props.disabled} onPress={copy}>{fallback.link ? "Copy link" : "Copy text"}</Button>}
    </div>}
  </div>;
}
