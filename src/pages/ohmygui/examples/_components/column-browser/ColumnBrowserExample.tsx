import { useState } from "react";
import { BuildingsIcon, CarIcon, LightningIcon, PlugIcon, ShieldCheckIcon, UsersIcon, MapPinIcon, ClockIcon, KeyIcon, StackIcon } from "@phosphor-icons/react";
import { Button, ColumnBrowser, HStack, Link, Picker, Text, ThemeScope, Toggle, VStack } from "@/ohmygui";
import { actions, effectivePermission, infrastructure, initialPath, initialRules, principals, resolvePath, type Action, type Decision, type Principal, type Resource, type Rules } from "./permissions";

function resourceIcon(kind: string) {
  switch (kind) {
    case "Business": return <BuildingsIcon />;
    case "Location": return <MapPinIcon />;
    case "Vehicle": return <CarIcon />;
    case "Charger": return <LightningIcon />;
    case "Connector": return <PlugIcon />;
    case "Charging session": case "Session collection": return <ClockIcon />;
    case "Identity": case "User": case "Team": return <UsersIcon />;
    case "Credentials": return <KeyIcon />;
    case "App": return <StackIcon />;
    default: return <ShieldCheckIcon />;
  }
}

export default function ColumnBrowserExample() {
  const [path, setPath] = useState<string[]>(initialPath), [dark, setDark] = useState(true);
  const [principal, setPrincipal] = useState<Principal>("operations"), [rules, setRules] = useState<Rules>(initialRules);
  const [action, setAction] = useState<Action>("operate"), [notice, setNotice] = useState("");
  const ancestry = resolvePath(path), actionName = actions.find(item => item.id === action)!.label;
  const principalName = principals.find(item => item.value === principal)!.label;
  function updateRule(resource: Resource, ancestors: Resource[], value: Decision) {
    setRules(previous => {
      const next = { ...previous[resource.id]?.[principal] };
      const inherited = effectivePermission(ancestors, principal, action, previous).decision;
      if (value === inherited) delete next[action]; else next[action] = value;
      return { ...previous, [resource.id]: { ...previous[resource.id], [principal]: next } };
    });
    setNotice(`${principalName}: ${actionName} set to ${value} on ${resource.name}.`);
  }
  function renderEntries(entries: Resource[], ancestors: Resource[] = []) {
    return entries.map(entry => {
      const lineage = [...ancestors, entry], effective = effectivePermission(lineage, principal, action, rules);
      const allowed = effective.decision === "allow";
      return <ColumnBrowser.Item key={entry.id} id={entry.id}
        label={<VStack as="span" gap="xs"><Text as="span">{entry.name}</Text><Text as="span" variant="caption" color="muted">{entry.kind}</Text></VStack>}
        textValue={entry.name} branch={!!entry.children} startContent={resourceIcon(entry.kind)}
        controls={<Toggle aria-label={`${actionName} for ${principalName} on ${entry.name}`} checked={allowed} onChange={event => updateRule(entry, ancestors, event.target.checked ? "allow" : "deny")} />}>
        {entry.children && renderEntries(entry.children, lineage)}
      </ColumnBrowser.Item>;
    });
  }
  return <ThemeScope preset="modern" mode={dark ? "dark" : "light"}>
    <VStack as="main" className="column-browser-example" align="stretch">
      <HStack as="header" gap="md" justify="between" align="center" wrap>
        <HStack gap="sm" align="center"><ShieldCheckIcon size={28} /><VStack gap="xs"><Text as="h1" variant="subheadline" weight="semibold">Infrastructure access</Text><Text variant="caption" color="muted">VoltGrid · Toggle access at any level</Text></VStack></HStack>
        <HStack gap="md" align="center" wrap>
          <Picker aria-label="Edit permissions for" value={principal} onChange={event => { setPrincipal(event.target.value as Principal); setNotice(""); }} items={principals} />
          <Picker aria-label="Permission to edit" value={action} onChange={event => { setAction(event.target.value as Action); setNotice(""); }} items={actions.map(item => ({ value: item.id, label: item.label }))} />
          <Toggle label="Dark theme" checked={dark} onChange={event => setDark(event.target.checked)} />
          <Button variant="ghost" size="sm" onClick={() => { setRules(initialRules); setPath(initialPath); setAction("operate"); setNotice("Demo permissions reset."); }}>Reset demo</Button>
          <Link href="/ohmygui/column-browser">Component ↗</Link>
        </HStack>
      </HStack>
      <ColumnBrowser aria-label="Infrastructure permissions" rootLabel="Applications" path={path} onPathChange={setPath} defaultColumnWidth={300} minColumnWidth={260} resizable emptyState="No resources in this scope.">
        {renderEntries(infrastructure)}
      </ColumnBrowser>
      <HStack as="footer" justify="between" gap="md" align="center" wrap><Text variant="caption" color="muted">{ancestry.length ? ancestry.map(item => item.name).join(" / ") : "Applications"}</Text><Text variant="caption" color="muted" role="status">{notice || "Local demo"}</Text></HStack>
    </VStack>
  </ThemeScope>;
}
