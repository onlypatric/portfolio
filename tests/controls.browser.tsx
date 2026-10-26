/** Run in the Astro dev console:
 * import('/tests/controls.browser.tsx').then(m => m.runControlChecks())
 * Rerun with reduced-motion and forced-colors emulation enabled.
 */
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Checkbox } from "../src/ohmygui/input/Checkbox";
import { Button } from "../src/ohmygui/control/button/Button";

export async function runControlChecks() {
  const host = document.createElement("section");
  host.className = "light";
  host.style.cssText = "position:fixed;inset:20px;z-index:99999;background:white;color:black;padding:30px";
  document.body.append(host);
  const root = createRoot(host);
  const passed: string[] = [];
  const wait = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => {
    const element = host.querySelector<T>(selector);
    if (!element) throw new Error("Missing " + selector);
    return element;
  };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forced = matchMedia("(forced-colors: active)").matches;
  function Controlled() {
    const [checked, setChecked] = useState(false);
    return <label><Checkbox checked={checked} onChange={event => setChecked(event.currentTarget.checked)} />Controlled</label>;
  }
  try {
    flushSync(() => root.render(<form><label><Checkbox name="updates" value="yes" />Updates</label><Button type="reset">Reset</Button></form>));
    await wait();
    const input = query<HTMLInputElement>("input");
    flushSync(() => input.click());
    assert(input.checked && new FormData(query<HTMLFormElement>("form")).get("updates") === "yes", "Native form value");
    await wait(45);
    const interim = getComputedStyle(input, "::before").clipPath;
    const activeRipples = input.getAnimations({ subtree: true });
    await wait(360);
    const style = getComputedStyle(input), mark = getComputedStyle(input, "::after");
    if (forced) {
      assert(style.appearance === "auto" && mark.display === "none", "High contrast uses the native checkbox indicator");
    } else {
      assert(getComputedStyle(input, "::before").clipPath.includes("100%") && mark.opacity === "1", "Ripple fills the checkbox");
      assert(style.transitionDuration === "0s" && mark.transitionDuration === "0s", "No checkbox CSS transitions");
      if (reduced) assert(activeRipples.length === 0, "Reduced motion skips ripple animations");
      else assert(activeRipples.length === 2 && !interim.includes("100%") && !interim.includes("circle(0%"), `Fill and checkmark use an expanding circular ripple: ${activeRipples.length}, ${interim}`);
    }
    flushSync(() => query<HTMLButtonElement>('button[type="reset"]').click());
    await wait(45);
    if (!forced && !reduced) assert(input.getAnimations({ subtree: true }).length === 2, "Reset runs the inward unfill ripple");
    await wait(360);
    assert(!input.checked, "Native reset restores unchecked state");
    if (!forced) assert(getComputedStyle(input, "::after").opacity === "0", "Reset animates the checkmark out");
    flushSync(() => input.click()); await wait(45);
    flushSync(() => input.click()); await wait(45);
    if (!forced && !reduced) {
      const frames = (input.getAnimations({ subtree: true })[0]?.effect as KeyframeEffect)?.getKeyframes();
      assert(frames?.[0].clipPath !== "circle(100% at 50% 50%)" && frames?.[0].clipPath !== "circle(0% at 50% 50%)", "Rapid reversal continues from its visible radius");
    }
    await wait(360);
    assert(!input.checked && (forced || getComputedStyle(input, "::before").clipPath.includes("circle(0%")), "Rapid reversal settles empty");
    passed.push("PASS native form value/reset and circular fill/unfill ripple without transitions");

    flushSync(() => root.render(<Controlled />)); await wait();
    flushSync(() => query<HTMLInputElement>("input").click()); await wait();
    assert(query<HTMLInputElement>("input").checked, "Controlled change callback");
    flushSync(() => root.render(<Checkbox indeterminate aria-label="Mixed selection" />)); await wait();
    assert(query<HTMLInputElement>("input").indeterminate, "Native mixed state");
    if (!forced) assert(getComputedStyle(query("input"), "::after").borderTopWidth === "0px", "Mixed dash, not checkmark");
    flushSync(() => root.render(<Checkbox disabled aria-label="Unavailable option" />)); await wait();
    query<HTMLInputElement>("input").click(); assert(!query<HTMLInputElement>("input").checked, "Disabled cannot toggle");
    passed.push("PASS controlled, indeterminate and disabled checkbox semantics");

    let clicked = 0, pointerUp = 0;
    const ref = { current: null as HTMLButtonElement | null };
    flushSync(() => root.render(<Button ref={ref} variant="unstyled" role="tab" data-ui="TestTab" aria-selected className="block w-full text-start" onClick={() => clicked++} onPointerUp={() => pointerUp++}><span data-slot="custom">Native content structure</span></Button>));
    const button = query<HTMLButtonElement>("button");
    assert(ref.current === button && button.dataset.ui === "TestTab" && button.hasAttribute("data-ui-button"), "Ref and owner hooks forwarded");
    assert(button.firstElementChild?.getAttribute("data-slot") === "custom", "Unstyled preserves direct child structure");
    button.focus(); assert(document.activeElement === button, "Focus forwarding");
    flushSync(() => button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 40, clientY: 40 })));
    assert(button.querySelector('[aria-hidden="true"]'), "Shared ripple feedback");
    button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true })); button.click();
    assert(clicked === 1 && pointerUp === 1, "Native click and pointer callbacks each run once");
    passed.push("PASS shared unstyled Button refs, hooks, DOM, focus, events and feedback");
    console.log(passed.join("\n"), { reduced, forced });
    return passed;
  } finally { root.unmount(); host.remove(); }
}

/** Button-only regression: runButtonRippleChecks() does not exercise Checkbox. */
export async function runButtonRippleChecks() {
  const host = document.createElement("section");
  host.style.cssText = "position:fixed;inset:20px;z-index:99999;background:white;padding:30px";
  document.body.append(host);
  const root = createRoot(host);
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    for (const variant of ["primary", "unstyled"] as const) {
      let clicks = 0;
      flushSync(() => root.render(<Button key={variant} variant={variant} onClick={() => clicks++}>Ripple test</Button>));
      const button = host.querySelector("button")!;
      const bounds = button.getBoundingClientRect();
      let previous: Element | null = null;
      for (let press = 0; press < 4; press++) {
        flushSync(() => button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: bounds.left + 8, clientY: bounds.top + 8 })));
        const ripple = button.querySelector<HTMLElement>('[data-slot="ripple"]');
        assert(ripple && ripple !== previous, variant + ": each rapid press needs a new ripple node");
        assert(ripple!.style.left === "8px" && ripple!.style.top === "8px", "Pointer origin is retained");
        assert(getComputedStyle(ripple!).animationName === "ui-button-ripple", "Ripple keyframe animation starts");
        flushSync(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
        assert(button.querySelector('[data-slot="ripple"]') === ripple, "Pointer click must not duplicate its press ripple");
        previous = ripple;
        await wait(35);
      }
      assert(clicks === 4, "Rapid click callbacks fire exactly once each");
      flushSync(() => button.click());
      const centered = button.querySelector<HTMLElement>('[data-slot="ripple"]');
      assert(centered && centered !== previous, "Keyboard/programmatic activation starts a fresh ripple");
      // CSSOM serializes 51.30859375px as 51.3086px; retain a sub-pixel centering check.
      assert(Math.abs(parseFloat(centered!.style.left) - bounds.width / 2) < .001 && Math.abs(parseFloat(centered!.style.top) - bounds.height / 2) < .001, `Non-pointer ripple is centered: ${centered!.style.left}/${centered!.style.top} vs ${bounds.width / 2}/${bounds.height / 2}`);
      assert(clicks === 5, "Non-pointer click callback fires once");
      await wait(reduced ? 50 : 850);
      assert(!button.querySelector('[data-slot="ripple"]'), "Animation completion cleans up ripple");
    }
    flushSync(() => root.render(<Button disabled>Disabled</Button>));
    host.querySelector("button")!.click();
    assert(!host.querySelector('[data-slot="ripple"]'), "Disabled button has no ripple");
    flushSync(() => root.render(<Button onPointerDown={event => event.preventDefault()}>Prevented</Button>));
    flushSync(() => host.querySelector("button")!.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true })));
    assert(!host.querySelector('[data-slot="ripple"]'), "Prevented pointer handler suppresses ripple");
    console.log("PASS Button rapid repeated pointer presses, keyed restart, origin, centered activation, callbacks and cleanup", { reduced });
    return true;
  } finally { root.unmount(); host.remove(); }
}
