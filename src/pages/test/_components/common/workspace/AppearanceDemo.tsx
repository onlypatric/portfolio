import { useState } from "react";
import { Button } from "@/_components/common/ohmygui/control/button/Button";
import { Badge } from "@/_components/common/ohmygui/content/Badge";
import { TextField } from "@/_components/common/ohmygui/input/TextField";
import { Combobox } from "@/_components/common/ohmygui/input/Combobox";
import { Toggle } from "@/_components/common/ohmygui/input/Toggle";
import { TabView } from "@/_components/common/ohmygui/navigation/TabView";
import { Dialog } from "@/_components/common/ohmygui/presentation/Dialog";
import { Menu } from "@/_components/common/ohmygui/presentation/Menu";
import { Popover } from "@/_components/common/ohmygui/presentation/Popover";
import { Tooltip } from "@/_components/common/ohmygui/presentation/Tooltip";
import { Toast } from "@/_components/common/ohmygui/presentation/Toast";

export function AppearanceDemo() {
  const [open, setOpen] = useState(false), [toast, setToast] = useState(false);
  const [compact, setCompact] = useState(false), [destination, setDestination] = useState("");
  return (
    <section className="lab-appearance-demo" data-ui-density={compact ? "compact" : "comfortable"}>
      <div className="lab-example-header"><h2>Make it yours</h2><span>TRY THE COMPONENTS</span></div>
      <p className="lab-example-copy">A shared palette, with room for your own touch. Try a denser layout or open a focused task.</p>
      <div className="lab-demo-controls">
        <Toggle label="Compact controls" checked={compact} onChange={(event) => setCompact(event.target.checked)} />
        <div className="lab-demo-actions"><Badge tone="soft" variant="accent">Soft</Badge><Badge tone="outline" variant="accent">Outline</Badge><Badge variant="accent">Solid</Badge></div>
        <TextField label="Workspace name" defaultValue="Personal workspace" helperText="A name that feels like home." classNames={{ root: "lab-demo-field" }} />
        <Combobox aria-label="Choose a component" value={destination} onValueChange={setDestination} placeholder="Find a component…" options={[{ value: "NavigationSplitView", label: "NavigationSplitView" }, { value: "Dialog", label: "Dialog" }, { value: "Badge", label: "Badge" }]} />
        <div className="lab-demo-actions">
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Menu trigger="Actions" items={[{ label: "Show confirmation", onSelect: () => setToast(true) }, { label: "Open dialog", onSelect: () => setOpen(true) }]} />
          <Popover trigger="A small note" title="Close at hand"><p className="lab-example-copy">Thoughtful details make a workspace feel familiar.</p></Popover>
          <Tooltip content="You can use the keyboard, too."><Button variant="outline">A little help</Button></Tooltip>
        </div>
        <TabView label="Preview options" activationMode="manual" tabs={[{ id: "palette", label: "Palette", content: <p className="lab-example-copy">The studio palette brings warm surfaces and quiet greens together.</p> }, { id: "spacing", label: "Spacing", content: <p className="lab-example-copy">Switch compact controls on above to change the spacing of this example.</p> }]} />
        {toast && <Toast message="Your workspace is ready." type="success" duration={0} onDismiss={() => setToast(false)} />}
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="A space of your own" description="Give your next idea a place to grow." actions={<Button onClick={() => { setOpen(false); setToast(true); }}>Save workspace</Button>}>
        <TextField label="Workspace title" defaultValue="My next idea" autoFocus />
      </Dialog>
    </section>
  );
}
