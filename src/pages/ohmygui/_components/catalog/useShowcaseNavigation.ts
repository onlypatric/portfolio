import { useCallback, useEffect, useRef, useState, type ComponentType, type MouseEvent } from 'react';
import { catalog, type CatalogEntry } from './catalog';
import { exampleModules } from './ExamplePreview';

const sources = import.meta.glob<string>('./examples/*.tsx', { query: '?raw', import: 'default' });
type Destination = { entry: CatalogEntry | null; examples: boolean; href: string; hash: string };
type View = { entry: CatalogEntry | null; examples: boolean; source: string; Example?: ComponentType; revision: number; hash: string };

/** Only registered showcase URLs belong to this local navigator. */
export function showcaseDestination(url: URL, origin: string): Destination | null {
  if (url.origin !== origin) return null;
  const path = url.pathname.replace(/\/$/, '');
  const entry = catalog.find(item => path === '/ohmygui/' + item.slug) ?? null;
  const examples = path === '/ohmygui/examples';
  if (path !== '/ohmygui' && !examples && !entry) return null;
  return { entry, examples, href: url.pathname + url.search + url.hash, hash: url.hash };
}

/** Load both assets before committing, so the old example stays usable until the next is ready. */
export async function loadShowcaseView(entry: CatalogEntry | null) {
  if (!entry) return { entry, source: '', Example: undefined };
  const key = './examples/' + entry.name + '.tsx';
  const loadExample = exampleModules[key], loadSource = sources[key];
  if (!loadExample || !loadSource) throw new Error('Missing showcase example for ' + entry.name);
  const [module, source] = await Promise.all([loadExample(), loadSource()]);
  return { entry, source, Example: module.default };
}

export function useShowcaseNavigation(initialEntry: CatalogEntry | null, initialSource: string, initialExamples = false) {
  const [view, setView] = useState<View>({ entry: initialEntry, source: initialSource, examples: initialExamples, revision: 0, hash: '' });
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const request = useRef(0), current = useRef(view);
  current.current = view;
  useEffect(() => () => { request.current++; }, []);

  const navigate = useCallback(async (destination: Destination, push: boolean) => {
    const version = ++request.current;
    setFailure(null);
    setPending(true);
    try {
      const next = await loadShowcaseView(destination.entry);
      if (version !== request.current) return;
      // History changes only after a successful load. Popstate already changed it.
      if (push && destination.href !== location.pathname + location.search + location.hash) {
        history.pushState(null, '', destination.href);
      }
      setView({ ...next, examples: destination.examples, revision: current.current.revision + 1, hash: destination.hash });
    } catch {
      if (version === request.current) setFailure(destination.href);
    } finally {
      if (version === request.current) setPending(false);
    }
  }, []);

  useEffect(() => {
    const pop = () => {
      const destination = showcaseDestination(new URL(location.href), location.origin);
      if (destination) void navigate(destination, false);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, [navigate]);

  useEffect(() => {
    if (!view.revision) return;
    document.title = view.examples ? 'Examples · OhMyGUI' : view.entry ? view.entry.name + ' · OhMyGUI' : 'OhMyGUI · The component library';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', view.examples ? 'Example usage of this library' : view.entry?.description ?? 'Explore every OhMyGUI component with an example and copyable source.');
  }, [view.revision, view.entry, view.examples]);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor || !event.currentTarget.contains(anchor) || anchor.hasAttribute('download') ||
      anchor.hasAttribute('data-astro-reload') || anchor.getAttribute('rel')?.split(/\s+/).includes('external') ||
      (anchor.target && anchor.target !== '_self') || anchor.getAttribute('href')?.startsWith('#')) return;
    const destination = showcaseDestination(new URL(anchor.href), location.origin);
    if (!destination) return;
    event.preventDefault();
    void navigate(destination, true);
  };

  return { ...view, pending, failure, onClick };
}
