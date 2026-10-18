import { useEffect, useRef, type RefObject } from "react";

/** Reset after the browser's default action, but never override a prevented reset. */
export function useFormReset<T extends { form: HTMLFormElement | null }>(ref: RefObject<T | null>, reset: () => void, formId?: string) {
  const callback = useRef(reset); callback.current = reset;
  useEffect(() => {
    let active = true;
    const form = ref.current?.form;
    const listener = (event: Event) => queueMicrotask(() => { if (active && !event.defaultPrevented) callback.current(); });
    form?.addEventListener("reset", listener);
    return () => { active = false; form?.removeEventListener("reset", listener); };
  }, [ref, formId]);
}
