// Deterministic controller regression; this does not replace real-browser paint checks.
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: 'custom' });
const globals = ['document', 'matchMedia', 'getComputedStyle', 'MutationObserver', 'IntersectionObserver', 'CSS', 'requestAnimationFrame', 'cancelAnimationFrame'];
const previous = new Map(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
try {
  const { createMotionController } = await server.ssrLoadModule('/src/ohmygui/behavior/_motion-controller.ts');
  let frames = new Map(), nextFrame = 0, observers = [], reduced = false;
  const listeners = new Map();
  class Animation {
    constructor(keyframes, playState = 'running') { this.playState = playState; this.pending = false; this.currentTime = 0; this.effect = { getKeyframes: () => keyframes }; }
    pause() { this.playState = 'paused'; }
    play() { this.playState = 'running'; }
    cancel() { this.playState = 'idle'; }
  }
  const element = (parentElement = null) => ({
    parentElement, opacity: '1', hidden: false, dataset: {}, ownAnimations: [], listeners: new Map(), scrollHeight: 100,
    style: { removeProperty() {} },
    getAnimations() { return this.ownAnimations; },
    matches() { return !!this.inert; },
    contains() { return false; },
    addEventListener(name, callback) { this.listeners.set(name, callback); },
    removeEventListener(name) { this.listeners.delete(name); },
  });
  Object.assign(globalThis, {
    document: { visibilityState: 'visible', activeElement: null, addEventListener(name, callback) { listeners.set(name, callback); }, removeEventListener(name) { listeners.delete(name); } },
    matchMedia: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} }),
    getComputedStyle: node => ({ opacity: node.opacity, display: 'block', visibility: 'visible', direction: 'ltr', getPropertyValue: () => '' }),
    MutationObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} disconnect() {} fire(visible = true) { this.callback([{ isIntersecting: visible, intersectionRect: { width: visible ? 100 : 0, height: visible ? 100 : 0 } }]); } },
    CSS: { supports: () => true },
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  const flushFrame = () => { const pending = frames; frames = new Map(); for (const callback of pending.values()) callback(16); };
  const mount = (pane, delay = 0) => {
    const host = element(pane), content = element(host), animations = [];
    content.animate = (keyframes, options) => { const animation = new Animation(keyframes); animation.options = options; animations.push(animation); return animation; };
    const controller = createMotionController(host, content, () => {});
    controller.update({ effect: 'slide', visible: true, duration: 450, delay });
    const observer = observers.at(-1);
    return { host, animations, controller, observer };
  };

  // Four Stagger children mount inside TabView's opacity:0 -> 1 WAAPI entrance.
  for (let visit = 0; visit < 3; visit++) {
    const pane = element(); pane.opacity = '0';
    pane.ownAnimations.push(new Animation([{ opacity: 0 }, { opacity: 1 }]));
    const cards = Array.from({ length: 4 }, (_, index) => mount(pane, index * 55));
    cards.forEach((card, index) => { assert.equal(card.animations[0].options.delay, index * 55, "Each card retains its stagger delay"); card.observer.fire(); });
    assert(cards.every(card => card.host.dataset.motionState === 'pending'), 'Cards wait while their pane is transparent');
    pane.opacity = '.25'; // WAAPI advances without a DOM attribute mutation or intersection change.
    flushFrame();
    assert(cards.every(card => card.host.dataset.motionState === 'running'), 'All four cards resume when the parent fade advances, without a DOM/intersection notification');
    cards.forEach(card => card.controller.dispose());
    assert.equal(frames.size, 0, 'Unmount cleans up scheduled visibility work');
  }
  console.log('PASS repeated tab remounts resume all four staggered card entrances during a parent WAAPI fade');

  for (const [description, keyframes, playState] of [
    ['permanent transparency', null, 'idle'],
    ['paused fade', [{ opacity: 0 }, { opacity: 1 }], 'paused'],
    ['unrelated transform', [{ transform: 'none' }, { transform: 'translateX(10px)' }], 'running'],
    ['zero-only opacity', [{ opacity: 0 }, { opacity: 0 }], 'running'],
  ]) {
    const pane = element(); pane.opacity = '0';
    if (keyframes) pane.ownAnimations.push(new Animation(keyframes, playState));
    const card = mount(pane); card.observer.fire();
    assert.equal(card.host.dataset.motionState, 'pending', description + ' remains hidden');
    assert.equal(frames.size, 0, description + ' does not schedule polling');
    card.controller.dispose();
  }
  const pane = element(); pane.opacity = '0'; pane.ownAnimations.push(new Animation([{ opacity: 0 }, { opacity: 1 }]));
  const offscreen = mount(pane); offscreen.observer.fire(false); assert.equal(frames.size, 0); offscreen.controller.dispose();
  const pending = mount(pane); pending.observer.fire(); assert(frames.size > 0); pending.controller.dispose(); assert.equal(frames.size, 0, 'Disposal cancels pending retries');
  const stopped = mount(pane); stopped.observer.fire(); pane.ownAnimations[0].pause(); flushFrame(); assert.equal(frames.size, 0, 'Paused parent stops retries'); stopped.controller.dispose();
  const visible = mount(element()); visible.observer.fire(); assert.equal(visible.host.dataset.motionState, 'running'); assert.equal(frames.size, 0); visible.controller.dispose();
  reduced = true;
  const accessible = mount(pane); accessible.observer.fire(); assert.equal(accessible.host.dataset.motionState, 'entered'); assert.equal(accessible.animations.length, 0); assert.equal(frames.size, 0); accessible.controller.dispose();
  console.log('PASS static/paused/irrelevant/offscreen parents do not poll; disposal, normal entrances and reduced motion stay intact');
} finally {
  for (const [key, descriptor] of previous) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  await server.close();
}
