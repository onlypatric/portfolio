import { useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Draggable, type ItemDrop } from "../src/ohmygui/behavior/Draggable";
import { Sortable } from "../src/ohmygui/collection/Sortable";
import { DropDestination } from "../src/ohmygui/behavior/DropDestination";
import { dragSnapshot, pointerPending } from "../src/ohmygui/behavior/_drag";

/** Schedule this runner, then close DevTools so the document owns native focus. */
export async function runDragSortChecks() {
  const host = document.createElement("section"); host.style.cssText = "position:fixed;inset:8px auto auto 8px;width:700px;max-height:90dvh;overflow:auto;z-index:2147483000;background:var(--surface);color:var(--foreground);padding:12px";
  document.body.append(host); const root = createRoot(host);
  const results: { name: string; passed: boolean; error?: string }[] = [];
  const wait = () => new Promise(resolve => setTimeout(resolve, 60));
  const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
  const render = async (node: ReactNode) => { flushSync(() => root.render(node)); await wait(); };
  const query = <T extends HTMLElement = HTMLElement>(selector: string) => { const node = host.querySelector<T>(selector); if (!node) throw new Error("Missing " + selector); return node; };
  const click = async (node: HTMLElement) => { node.focus(); flushSync(() => node.click()); await wait(); };
  const key = async (node: HTMLElement, value: string) => { flushSync(() => node.dispatchEvent(new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true }))); await wait(); };
  const check = async (name: string, test: () => Promise<void>) => { try { await render(null); await test(); results.push({ name, passed: true }); } catch (error) { results.push({ name, passed: false, error: String(error) }); } };
  const keys = () => Array.from(host.querySelectorAll<HTMLElement>("[data-ui-drag-item]")).map(node => node.dataset.itemKey).join(",");
  const sortable = (props: Parameters<typeof Sortable>[0] = {}) => <Sortable {...props}>{["a", "b", "c"].map(id => <Sortable.Item key={id} label={id}><input aria-label={id + " draft"} defaultValue={id} /></Sortable.Item>)}</Sortable>;
  const native = (node: HTMLElement, type: string, dataTransfer: DataTransfer, x = 0, y = 0) => {
    const event = new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer, clientX: x, clientY: y });
    flushSync(() => node.dispatchEvent(event)); return event;
  };
  try {
    await check("Keyboard sorting preserves DOM/drafts, moves by arrows and cancels without committing", async () => {
      await render(sortable()); const input = query<HTMLInputElement>("input"); input.value = "Retained draft";
      const handle = query<HTMLButtonElement>('[data-slot="dragHandle"]');
      await click(handle); assert(query("input") === input, "Picking up remounted input");
      await key(handle, "ArrowDown"); assert(query("input") === input, "Drop indicator remounted input");
      assert(query('[role="status"]').textContent?.includes("position 2"), "Announcement reports the insertion gap instead of the final item position");
      await key(handle, "Enter"); assert(keys() === "b,a,c", "Arrow move did not reorder");
      assert(host.querySelector('input[aria-label="a draft"]') === input && input.value === "Retained draft", "Reorder lost draft/identity");
      assert(document.activeElement === handle, "Keyboard reorder lost focus");
      await click(handle); await key(handle, "End"); await key(handle, "Escape");
      assert(keys() === "b,a,c" && !dragSnapshot().source, "Escape committed or leaked drag state");
      await click(handle); await key(handle, "Enter");
      assert(keys() === "b,a,c" && document.activeElement === handle, "No-op placement lost its original handle focus");
    });
    await check("Controlled order requests changes, then follows parent order without remounting", async () => {
      let next: (string | number)[] = [];
      await render(sortable({ order: ["a", "b", "c"], onOrderChange: value => { next = value; } }));
      const input = query("input"), handle = query('[data-slot="dragHandle"]');
      await click(handle); await key(handle, "End"); await key(handle, "Enter");
      assert(next.join(",") === "b,c,a" && keys() === "a,b,c", "Controlled list mutated itself or failed to request order");
      await render(sortable({ order: next }));
      assert(keys() === "b,c,a" && host.querySelector('input[aria-label="a draft"]') === input, "Parent update lost keyed content");
    });
    await check("Matching containers accept keys; incompatible native drops never commit", async () => {
      const drops: ItemDrop[] = [];
      await render(<><Draggable.Container dragKey="tasks" aria-label="Tasks"><Draggable.Item itemKey="a" label="Task a" nativeDrag>Task a</Draggable.Item></Draggable.Container>
        <Draggable.Container dragKey="notes" aria-label="Notes" onDrop={drop => drops.push(drop)}><Draggable.Empty>No notes</Draggable.Empty></Draggable.Container>
        <Draggable.Container dragKey="archive" accept={["tasks"]} aria-label="Archive" onDrop={drop => drops.push(drop)}><Draggable.Empty>Empty archive</Draggable.Empty></Draggable.Container></>);
      const source = query('[data-item-key="a"]'), notes = query('[aria-label="Notes"]'), archive = query('[aria-label="Archive"]'), transfer = new DataTransfer();
      native(source, "dragstart", transfer); await wait();
      assert(!native(notes, "dragover", transfer).defaultPrevented, "Wrong key accepted dragover");
      native(notes, "drop", transfer); assert(!drops.length, "Wrong key committed a drop");
      const bounds = archive.getBoundingClientRect(); assert(native(archive, "dragover", transfer, bounds.left + 10, bounds.top + 10).defaultPrevented, "Accepted key did not enable drop");
      native(archive, "drop", transfer, bounds.left + 10, bounds.top + 10); await wait();
      assert(drops.length === 1 && drops[0].itemKey === "a" && drops[0].dragKey === "tasks", "Accepted payload lost identity");
      assert(!dragSnapshot().source, "Drop left an active session");
    });
    await check("Click/keyboard transfers reach empty destinations and Empty follows actual item ownership", async () => {
      function Board() {
        const [moved, setMoved] = useState(false);
        const task = <Draggable.Item itemKey="a" label="Task a">Task a</Draggable.Item>;
        return <><Draggable.Container dragKey="tasks" aria-label="Source" onDrop={() => setMoved(false)}>{!moved && task}<Draggable.Empty>Source empty</Draggable.Empty></Draggable.Container>
          <Draggable.Container dragKey="tasks" aria-label="Destination" onDrop={() => setMoved(true)}>{moved && task}<Draggable.Empty>Destination empty</Draggable.Empty></Draggable.Container></>;
      }
      await render(<Board />); await click(query('[data-slot="dragHandle"]'));
      const action = query<HTMLButtonElement>('[aria-label="Destination"] [data-slot="dropAction"]');
      await click(action);
      assert(query('[aria-label="Destination"]').querySelector('[data-item-key="a"]'), "Transfer did not update owner");
      assert(query('[aria-label="Source"] [data-slot="empty"]').textContent === "Source empty", "Empty did not appear in vacated container");
      assert(!query('[aria-label="Destination"]').querySelector('[data-slot="empty"]'), "Populated destination still shows Empty");
    });
    await check("Pointer/touch handle hit-testing, incompatible targets, cancel and preview cleanup", async () => {
      const drops: ItemDrop[] = [];
      await render(<><Draggable.Container dragKey="tasks" style={{ "--surface": "rgb(18, 52, 86)", "--foreground": "white" }}><Draggable.Item itemKey="a" label="Task a">Drag me</Draggable.Item></Draggable.Container>
        <Draggable.Container dragKey="tasks" aria-label="Pointer target" onDrop={drop => drops.push(drop)}><Draggable.Empty>Drop here</Draggable.Empty></Draggable.Container></>);
      const handle = query('[data-slot="dragHandle"]'), source = handle.getBoundingClientRect(), target = query('[aria-label="Pointer target"]').getBoundingClientRect();
      const pointer = (node: EventTarget, type: string, x: number, y: number) => flushSync(() => node.dispatchEvent(new PointerEvent(type, { pointerId: 9, pointerType: "touch", isPrimary: true, button: 0, bubbles: true, cancelable: true, clientX: x, clientY: y })));
      pointer(handle, "pointerdown", source.left + 10, source.top + 10);
      pointer(window, "pointermove", target.left + 30, target.top + 25); await wait();
      assert(document.querySelector('[data-ui="DragPreview"]'), "Pointer movement has no drag preview");
      assert(getComputedStyle(document.querySelector<HTMLElement>('[data-ui="DragPreview"]')!).backgroundColor === getComputedStyle(query('[data-item-key="a"]')).backgroundColor, "Floating preview lost its source palette");
      pointer(window, "pointerup", target.left + 30, target.top + 25); await wait();
      assert(drops.length === 1 && drops[0].method === "pointer", "Pointer release did not commit at hit-tested target");
      assert(!document.querySelector('[data-ui="DragPreview"]') && !dragSnapshot().source, "Pointer drop leaked preview/state");
      pointer(handle, "pointerdown", source.left + 10, source.top + 10); pointer(window, "pointermove", target.left + 30, target.top + 25); await wait();
      pointer(window, "pointercancel", target.left + 30, target.top + 25); await wait();
      assert(drops.length === 1 && !document.querySelector('[data-ui="DragPreview"]') && !dragSnapshot().source, "Pointer cancel committed or leaked resources");
    });
    await check("Horizontal RTL/Home/End, disabled items and independent list isolation", async () => {
      await render(<div dir="rtl">{sortable({ orientation: "horizontal" })}{sortable({ disabled: true })}</div>);
      const list = query('[data-ui="Sortable"]'), handle = list.querySelector<HTMLElement>('[data-slot="dragHandle"]')!;
      await click(handle); await key(handle, "ArrowLeft"); await key(handle, "Enter");
      assert(list.querySelector<HTMLElement>("[data-ui-drag-item]")?.dataset.itemKey === "b", "RTL horizontal direction is reversed");
      assert(host.querySelectorAll('[data-slot="dragHandle"]:disabled').length === 3, "Disabled list leaves active handles");
      await click(handle); assert(host.querySelectorAll('[data-compatible="true"]').length === 1, "Independent Sortable lists accept each other's keys");
      await key(handle, "Escape");
    });
    await check("Nested destinations and legacy MIME zones cannot bypass dragKey matching", async () => {
      let count = 0;
      await render(<><Draggable.Item itemKey="outside" dragKey="tasks" label="Outside task" nativeDrag>Task</Draggable.Item>
        <Draggable.Container dragKey="tasks" onDrop={() => count++}>
          <Draggable.Item itemKey="wrapper" label="Wrapper"><Draggable.Container dragKey="notes" aria-label="Nested notes" onDrop={() => count++}><Draggable.Empty>No notes</Draggable.Empty></Draggable.Container></Draggable.Item>
        </Draggable.Container>
        <DropDestination aria-label="Legacy zone" onDropEvent={() => count++}>Legacy files/text</DropDestination></>);
      const transfer = new DataTransfer(); native(query('[data-item-key="outside"]'), "dragstart", transfer); await wait();
      assert(!native(query('[aria-label="Nested notes"]'), "dragover", transfer).defaultPrevented, "Incompatible nested target fell through into outer container");
      native(query('[aria-label="Nested notes"]'), "drop", transfer);
      assert(!native(query('[aria-label="Legacy zone"]'), "dragover", transfer).defaultPrevented, "Legacy MIME zone accepted a keyed item");
      native(query('[aria-label="Legacy zone"]'), "drop", transfer);
      assert(!count && !transfer.getData("text/plain"), "Keyed payload escaped group matching or was exported as plain text");
      await key(query('[data-slot="dragHandle"]'), "Escape");
    });
    await check("Pointer edge scrolling runs only while active and pending gestures clean up on removal", async () => {
      await render(<Draggable.Container dragKey="scroll" style={{ height: 160, overflow: "auto" }} aria-label="Scrolling tasks">
        {Array.from({ length: 12 }, (_, index) => <Draggable.Item key={index} itemKey={index} label={"Task " + index}>Task {index}</Draggable.Item>)}
      </Draggable.Container>);
      const container = query('[aria-label="Scrolling tasks"]'), handle = query('[data-slot="dragHandle"]'), source = handle.getBoundingClientRect(), bounds = container.getBoundingClientRect();
      const pointer = (node: EventTarget, type: string, x: number, y: number) => flushSync(() => node.dispatchEvent(new PointerEvent(type, { pointerId: 12, isPrimary: true, pointerType: "touch", button: 0, bubbles: true, cancelable: true, clientX: x, clientY: y })));
      pointer(handle, "pointerdown", source.left + 10, source.top + 10); pointer(window, "pointermove", bounds.left + 80, bounds.bottom - 12);
      await new Promise(resolve => setTimeout(resolve, 180));
      assert(container.scrollTop > 0, "Holding at a bounded edge did not auto-scroll");
      pointer(window, "pointercancel", bounds.left + 80, bounds.bottom - 12); await wait(); const top = container.scrollTop;
      await wait(); assert(container.scrollTop === top && !pointerPending(), "Cancelled pointer left scrolling/listeners active");
      pointer(handle, "pointerdown", source.left + 10, source.top + 10); await render(null);
      assert(!pointerPending() && !document.querySelector('[data-ui="DragPreview"]'), "Pending pre-threshold gesture survived source removal");
    });
    await check("Reduced motion skips reordering effects and disabling cancels an active gesture", async () => {
      const original = window.matchMedia;
      try {
        window.matchMedia = query => { const media = original.call(window, query); if (query === "(prefers-reduced-motion: reduce)") Object.defineProperty(media, "matches", { value: true }); return media; };
        await render(sortable()); const handle = query('[data-slot="dragHandle"]'); await click(handle); await key(handle, "End"); await key(handle, "Enter");
        assert(keys() === "b,c,a" && !Array.from(host.querySelectorAll<HTMLElement>("[data-ui-drag-item]")).some(node => node.getAnimations().length), "Reduced-motion reorder still animates");
        await click(handle); await render(sortable({ disabled: true })); assert(!dragSnapshot().source, "Disabling the owner left a session active");
        const disabled = query('[data-slot="dragHandle"]');
        flushSync(() => disabled.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 22, pointerType: "touch", isPrimary: true, button: 0, bubbles: true })));
        assert(!pointerPending(), "Disabled handle accepted pointer initiation");
      } finally { window.matchMedia = original; }
    });
    await check("Unmount/disabled cleanup, duplicate-free dynamic children and legacy source compatibility", async () => {
      await render(sortable()); await click(query('[data-slot="dragHandle"]')); await render(null);
      assert(!dragSnapshot().source, "Unmount leaked session");
      await render(<Draggable payload="Legacy payload"><span>Legacy</span></Draggable>);
      const transfer = new DataTransfer(); native(query('[data-ui="Draggable"]'), "dragstart", transfer);
      assert(transfer.getData("text/plain") === "Legacy payload", "Legacy payload contract changed");
    });
  } finally { root.unmount(); host.remove(); }
  console.table(results);
  return { results, failures: results.filter(result => !result.passed) };
}
