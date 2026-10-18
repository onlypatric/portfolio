import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Text } from "@/_components/common/ohmygui/content/Text";

export const exampleModules = import.meta.glob<{ default: ComponentType }>("./examples/*.tsx");

class PreviewBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    return this.state.error ? <Text as="p" role="alert">This example could not render. Reload the page to retry; its source remains available below.</Text> : this.props.children;
  }
}

/** Retain prerendered markup, then replace only this preview with its interactive React example. */
export function ExamplePreview({ name, children }: { name: string; children?: ReactNode }) {
  const [Example, setExample] = useState<ComponentType | null>(null);
  const [error, setError] = useState(false), [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setExample(null); setError(false);
    const load = exampleModules["./examples/" + name + ".tsx"];
    if (!load) { setError(true); return; }
    load().then((module) => { if (!cancelled) setExample(() => module.default); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [name, attempt]);
  return <div className="showcase-preview" data-example={name} data-preview-state={error ? "error" : Example ? "ready" : "static"}>
    {error ? <div role="alert"><Text as="p">The interactive example could not load.</Text><Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>Retry example</Button></div> :
      Example ? <PreviewBoundary key={name + attempt}><Example /></PreviewBoundary> : children}
  </div>;
}
