export type Action = "view" | "operate" | "manage" | "billing" | "export";
export type Decision = "allow" | "deny";
export type Principal = "operations" | "fleet" | "auditor";
export type Resource = { id: string; name: string; kind: string; description: string; children?: Resource[] };
export type Rules = Record<string, Partial<Record<Principal, Partial<Record<Action, Decision>>>>>;
export const actions: { id: Action; label: string; description: string }[] = [
  { id: "view", label: "View resource", description: "Read resource details and activity." },
  { id: "operate", label: "Operate / use", description: "Start or stop charging, assign vehicles, or perform operational actions." },
  { id: "manage", label: "Manage configuration", description: "Change settings, membership, or resource configuration." },
  { id: "billing", label: "View billing", description: "Read costs, tariffs, invoices, and payment details." },
  { id: "export", label: "Export data", description: "Download resource records and activity reports." },
];
export const principals: { value: Principal; label: string }[] = [
  { value: "operations", label: "Operations team" }, { value: "fleet", label: "Fleet managers" }, { value: "auditor", label: "External auditor" },
];
const resource = (id: string, name: string, kind: string, description: string, children?: Resource[]): Resource => ({ id, name, kind, description, children });
const charger = (id: string, name: string): Resource => resource(id, name, "Charger", "A 150 kW DC charging station. Operational permissions descend to its connectors and sessions.", [
  resource(id + "-ccs1", "Connector 1 · CCS2", "Connector", "Primary connector. Review access to live charging and its session history.", [
    resource(id + "-sessions", "Charging sessions", "Session collection", "Charging activity on this connector. Export and billing access can be scoped separately.", [
      resource(id + "-session-1042", "Session #1042 · Active", "Charging session", "Vehicle EV-024 · 34.8 kWh delivered · Started 09:42. Stopping this session requires operational access."),
      resource(id + "-session-1041", "Session #1041 · Completed", "Charging session", "Vehicle EV-018 · 52.1 kWh delivered · Completed 08:16. Includes a metering record and a billing receipt."),
    ]),
  ]),
  resource(id + "-ccs2", "Connector 2 · CCS2", "Connector", "Secondary connector. Available for charging; no sessions recorded yet.", []),
]);
export const infrastructure: Resource[] = [resource("app", "Control room", "App", "Application-wide permissions are the starting point for every resource below.", [
  resource("GLS VEPAL", "GLS VEPAL Energy", "Business", "A charging network with public sites, fleet vehicles, and a separate finance scope.", [
    resource("milan", "Milan · Central depot", "Location", "An operational depot with two chargers and assigned fleet vehicles.", [
      charger("charger-01", "Charger CH-01"), charger("charger-02", "Charger CH-02 · Maintenance"),
      resource("vehicle-024", "EV-024 · Delivery van", "Vehicle", "An electric delivery van assigned to the Milan depot. Fleet managers can operate it without configuring chargers."),
      resource("vehicle-018", "EV-018 · Pool car", "Vehicle", "A shared company vehicle. Vehicle access inherits from its location unless explicitly overridden."),
      resource("milan-tariffs", "Depot tariffs", "Tariff", "Time-of-use rates and employee charging discounts. Billing access is separate from operational access."),
    ]),
    resource("rome", "Rome · Airport hub", "Location", "A public charging site managed by a different local team.", [charger("charger-03", "Charger CH-03"), resource("vehicle-031", "EV-031 · Service van", "Vehicle", "A service vehicle assigned to the airport hub.")]),
    resource("GLS VEPAL-billing", "Invoices & settlements", "Billing", "Business-level billing records. Restricted to finance-approved groups."),
  ]),
  resource("harbor", "Harbor Logistics", "Business", "An independent tenant. Explicit business rules prevent access inherited from broader application roles.", [
    resource("harbor-yard", "Rotterdam · Freight yard", "Location", "A private logistics depot.", [charger("charger-04", "Charger CH-04"), resource("vehicle-044", "EV-044 · Yard tractor", "Vehicle", "An electric yard vehicle in the Harbor Logistics fleet.")]),
  ]),
  resource("users", "User stuff", "Identity", "Users, groups, and credentials have their own access rules.", [
    resource("members", "People & memberships", "Directory", "Manage invitations, business membership, and user profiles.", [resource("alex", "Alex Morgan", "User", "Operations engineer · GLS VEPAL Energy."), resource("maya", "Maya Patel", "User", "Fleet administrator · GLS VEPAL Energy.")]),
    resource("groups", "Teams & roles", "Role directory", "Inspect group membership and delegated access.", [resource("dispatch", "Dispatch team", "Team", "Dispatchers coordinate vehicles and charging schedules."), resource("finance", "Finance team", "Team", "Finance members review settlements and billing exports.")]),
    resource("tokens", "API keys & service accounts", "Credentials", "Automation credentials are restricted even when the containing directory is visible."),
  ]),
  resource("integrations", "Integrations", "Integration directory", "Connected systems and machine access.", [resource("ocpp", "OCPP gateway", "Integration", "Charger connectivity and remote commands."), resource("webhooks", "Webhooks", "Integration", "Session events sent to subscribed business systems.")]),
  resource("audit", "Audit & compliance", "Audit", "Read-only access to security events, policy changes, and charging records.", [resource("events", "Access events", "Audit log", "A chronological record of permission changes and resource access."), resource("reports", "Compliance exports", "Report", "Exportable reports for an external compliance review.")]),
])];

export const initialRules: Rules = {
  app: { operations: { view: "allow", operate: "allow", manage: "deny", billing: "deny", export: "deny" }, fleet: { view: "allow", operate: "deny", manage: "deny", billing: "deny", export: "deny" }, auditor: { view: "deny", operate: "deny", manage: "deny", billing: "deny", export: "deny" } },
  "GLS VEPAL": { operations: { manage: "allow" }, auditor: { view: "allow", export: "allow" } },
  "charger-02": { operations: { operate: "deny" } },
  "vehicle-024": { fleet: { operate: "allow", manage: "allow" } },
  "vehicle-018": { fleet: { operate: "allow" } },
  "GLS VEPAL-billing": { operations: { view: "deny", manage: "deny" }, auditor: { view: "deny", export: "deny" } },
  harbor: { operations: { view: "deny", operate: "deny", manage: "deny" }, fleet: { view: "deny" } },
  users: { operations: { operate: "deny", manage: "deny" }, fleet: { view: "deny" }, auditor: { view: "deny" } },
  tokens: { operations: { view: "deny" } },
  audit: { auditor: { view: "allow", export: "allow" }, operations: { export: "allow" } },
};
export const initialPath = ["app", "GLS VEPAL", "milan", "charger-01", "charger-01-ccs1", "charger-01-sessions", "charger-01-session-1042"];
export function resolvePath(path: readonly string[]): Resource[] {
  const result: Resource[] = []; let level = infrastructure;
  for (const id of path) { const node = level.find(item => item.id === id); if (!node) break; result.push(node); level = node.children ?? []; }
  return result;
}
/** Demo policy: nearest explicit rule wins per action; missing rules deny by default. */
export function effectivePermission(ancestry: readonly Resource[], principal: Principal, action: Action, rules: Rules): { decision: Decision; source?: Resource } {
  for (let index = ancestry.length - 1; index >= 0; index--) {
    const source = ancestry[index], decision = rules[source.id]?.[principal]?.[action];
    if (decision) return { decision, source };
  }
  return { decision: "deny" };
}
