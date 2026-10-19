/** On /ohmygui: import('/tests/showcase-navigation.browser.ts').then(m => m.runShowcaseNavigationChecks()) */
export async function runShowcaseNavigationChecks() {
  const shell = document.querySelector<HTMLElement>('.ohmy-showcase');
  if (!shell) throw new Error('Open an OhMyGUI showcase page first.');
  const documentRoot = document.documentElement;
  const pane = shell.querySelector<HTMLElement>('.showcase-split > [data-slot="content"]')!;
  const sidebar = shell.querySelector<HTMLElement>('.showcase-split > [data-slot="sidebar"]')!;
  const search = shell.querySelector<HTMLInputElement>('input[type="search"]')!;
  const split = shell.querySelector<HTMLElement>('.showcase-split')!;
  const animation = pane.animate;
  const originalPath = location.pathname + location.search + location.hash;
  const initialQuery = search.value;
  let animations = 0;
  pane.animate = function (...args) { animations++; return animation.apply(this, args); };
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const waitFor = async (check: () => boolean) => {
    const start = performance.now();
    while (!check()) { if (performance.now() - start > 8000) throw new Error('Timed out awaiting showcase state'); await new Promise(resolve => setTimeout(resolve, 16)); }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };
  const select = (slug: string) => {
    const link = shell.querySelector<HTMLAnchorElement>(`a[href="/ohmygui/${slug}"]`);
    if (!link) throw new Error('Missing destination: ' + slug);
    link.click();
  };
  const ready = (slug: string) => shell.dataset.showcaseRoute === slug && !!shell.querySelector('[data-preview-state="ready"]');
  try {
    if (search.value) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(search, ''); search.dispatchEvent(new Event('input', { bubbles: true }));
      await waitFor(() => !!shell.querySelector('a[href="/ohmygui/button-group"]'));
    }
    const theme = shell.dataset.theme, density = shell.dataset.uiDensity, collapsed = split.dataset.collapsed;
    const sidebarPosition = sidebar.scrollTop;
    const beforeAnimations = animations;
    select('button-group'); await waitFor(() => ready('button-group'));
    assert(document.documentElement === documentRoot && document.querySelector('.ohmy-showcase') === shell, 'Shell/document persist');
    assert(document.querySelector('input[type="search"]') === search, 'Search node persists');
    assert(shell.dataset.theme === theme && shell.dataset.uiDensity === density && split.dataset.collapsed === collapsed, 'Preferences/collapse persist');
    assert(Math.abs(sidebar.scrollTop - sidebarPosition) < 2, 'Sidebar scroll persists');
    assert(location.pathname.replace(/\/$/, '') === '/ohmygui/button-group' && document.title === 'ButtonGroup · OhMyGUI', 'URL/title update');
    assert(shell.querySelector('[data-ui="CodeTextBlock"]')?.textContent?.includes('ButtonGroup'), 'Source follows destination');
    assert(document.activeElement?.id === 'component-content', 'Focus moves to content');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(forced-colors: active)').matches) assert(animations > beforeAnimations, 'Content pane animates');
    else assert(animations === beforeAnimations, 'Reduced motion/forced colors skip pane animation');
    const increase = [...shell.querySelectorAll<HTMLButtonElement>('.showcase-preview button')].find(button => button.textContent?.trim() === 'Increase')!;
    increase.click(); await waitFor(() => !!shell.querySelector('.showcase-preview')?.textContent?.includes('Quantity: 1'));
    select('button'); select('checkbox'); await waitFor(() => ready('checkbox'));
    assert(!shell.querySelector('[data-example="Button"]'), 'Rapid navigation commits only the latest example');
    history.back(); await waitFor(() => ready('button-group'));
    history.forward(); await waitFor(() => ready('checkbox'));
    assert(document.documentElement === documentRoot, 'Back/Forward avoid document reload');
    console.log('PASS live showcase: persistent shell/search/sidebar/settings, content motion/focus, paired source, interactive example, latest-only rapid selection, Back/Forward.');
    return true;
  } finally {
    pane.animate = animation;
    // Restore the original destination without adding another history entry.
    history.replaceState(null, '', originalPath); window.dispatchEvent(new PopStateEvent('popstate'));
    if (initialQuery) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
      setter.call(search, initialQuery); search.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}


/** Run with the actual browser viewport set to 375px. */
export async function runShowcaseMobileNavigationChecks() {
  const shell = document.querySelector<HTMLElement>('.ohmy-showcase')!;
  const split = shell.querySelector<HTMLElement>('.showcase-split')!;
  if (split.dataset.compact !== 'true') throw new Error('Use a narrow viewport first.');
  const wait = async (check: () => boolean) => {
    const start = performance.now();
    while (!check()) { if (performance.now() - start > 8000) throw new Error('Mobile navigation timeout'); await new Promise(resolve => setTimeout(resolve, 16)); }
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  };
  const sidebar = split.querySelector<HTMLElement>(':scope > [data-slot="sidebar"]')!;
  const control = split.querySelector<HTMLButtonElement>(':scope > [data-slot="controls"] > [data-slot="paneButton"][aria-controls$="-sidebar"]')!;
  control.click(); await wait(() => !sidebar.inert);
  const destination = shell.dataset.showcaseRoute === 'button-group' ? 'button' : 'button-group';
  const link = sidebar.querySelector<HTMLAnchorElement>(`a[href="/ohmygui/${destination}"]`)!;
  link.focus(); link.click();
  await wait(() => shell.dataset.showcaseRoute === destination && sidebar.inert && document.activeElement?.id === 'component-content');
  if (document.activeElement?.id !== 'component-content') throw new Error('Focus did not reach the content');
  if (document.querySelector('.ohmy-showcase') !== shell) throw new Error('Mobile shell was replaced');
  const pane = split.querySelector<HTMLElement>(':scope > [data-slot="content"]')!;
  await Promise.allSettled(pane.getAnimations().map(animation => animation.finished));
  if (split.scrollWidth > split.clientWidth + 1) throw new Error('Mobile viewport overflows');
  console.log('PASS 375px navigation: directory selection returns to content, focus stays out of hidden panes, shell persists, no overflow.');
  return true;
}
