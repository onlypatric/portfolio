import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";

// Run after npm run build. Inspect the actual library, examples and emitted HTML.
const root = "src/pages/ohmygui/_components/catalog";
const output = existsSync("dist/client/index.html") ? "dist/client" : "dist";
const read = path => readFileSync(path, "utf8");
const showcaseSource = read(root + "/Showcase.tsx");
assert.doesNotMatch(showcaseSource.slice(showcaseSource.indexOf("  return <")), /<\/?[a-z][\w-]*(?:\s|\/?>)/, "Showcase composes OhMyGUI components, not intrinsic JSX elements");
const catalog = JSON.parse(read(root + "/catalog.ts").split("export const catalog: CatalogEntry[] = ")[1].replace(/;\s*$/, ""));
const library = "src/_components/common/ohmygui";
const categories = ["layout", "content", "input", "collection", "navigation", "presentation", "drawing", "behavior"];
const exported = categories.flatMap(category => [...read(library + "/" + category + "/index.ts").matchAll(/^export \{ (\w+) \}/gm)].map(match => match[1]));
exported.push("ModalSurface");
assert.deepEqual(catalog.map(item => item.name).sort(), exported.sort(), "Every library component has a view");
assert.equal(new Set(catalog.map(item => item.slug)).size, catalog.length, "Unique URLs");
assert.deepEqual(readdirSync(root + "/examples").sort(), catalog.map(item => item.name + ".tsx").sort(), "One executable example per component");
const decode = text => text.replace(/&#x([\da-f]+);|&#(\d+);|&(amp|lt|gt|quot|apos);/gi, (_, hex, decimal, name) => hex ? String.fromCodePoint(parseInt(hex, 16)) : decimal ? String.fromCodePoint(Number(decimal)) : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[name]));
const pages = [output + "/ohmygui/index.html", ...catalog.map(item => output + "/ohmygui/" + item.slug + "/index.html")];
for (const [index, path] of pages.entries()) {
  const html = read(path);
  assert.equal((html.match(/<main\b/g) ?? []).length, 1, path + ": main landmark");
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, path + ": duplicate ids");
  if (index) {
    const entry = catalog[index - 1], source = read(root + "/examples/" + entry.name + ".tsx");
    assert.match(source, new RegExp("<" + entry.name + "(?:[\\s/>])"), entry.name + ": target really used");
    const panel = html.slice(html.indexOf("showcase-source-panel"));
    const code = panel.match(/<code\b[^>]*>([\s\S]*?)<\/code>/)?.[1];
    assert.equal(decode(code ?? ""), source, entry.name + ": displayed source equals executable file");
    const preview = html.match(/data-example="[^"]+"[^>]*>([\s\S]*?)<\/astro-slot>/)?.[1];
    assert(preview?.includes("data-ui="), entry.name + ": real prerendered preview");
    assert(html.includes("<title>" + entry.name + " · OhMyGUI</title>"), entry.name + ": page title");
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const url = decode(match[1]);
    const target = resolve(output, "." + url);
    assert(target.startsWith(resolve(output)), "Local URL scope");
    assert(existsSync(target) || existsSync(target + "/index.html") || existsSync(target + ".html"), path + ": missing link " + url);
  }
}
const examples = read(output + "/ohmygui/examples/index.html");
assert.match(examples, /<title>Examples · OhMyGUI<\/title>/);
assert.match(examples, /<h1[^>]*>Example usage of this library<\/h1>/);
assert.match(examples, /href="\/ohmygui\/examples"[^>]*aria-current="page"/);
assert.equal((examples.match(/<main\b/g) ?? []).length, 1, "Examples keeps one main landmark");
assert.equal((examples.match(/<h1\b/g) ?? []).length, 1, "Examples keeps one page title");
assert.doesNotMatch(examples, /data-example=|showcase-source-panel/, "Examples does not render a component preview/source");
const walk = dir => readdirSync(dir).flatMap(name => statSync(dir + "/" + name).isDirectory() ? walk(dir + "/" + name) : [dir + "/" + name]);
assert(!walk(output + "/ohmygui").some(path => /README|CHANGELOG/.test(path)), "No public docs routes");
const previewOf = slug => read(output + "/ohmygui/" + slug + "/index.html").match(/data-example="[^"]+"[^>]*>([\s\S]*?)<\/astro-slot>/)?.[1] ?? "";
const groupedPreview = previewOf("button-group");
assert.equal((groupedPreview.match(/data-ui="ButtonGroup"/g) ?? []).length, 2, "Horizontal and vertical ButtonGroups are rendered");
assert.equal((groupedPreview.match(/<button\b[^>]*disabled=""/g) ?? []).length, 2, "Group-wide disabling reaches both buttons");
const barPreview = previewOf("tab-bar");
assert.match(barPreview, /<nav\b/, "TabBar retains navigation semantics");
assert.doesNotMatch(barPreview, /role="tab(?:list)?"/, "Route links must not pretend to switch local panels");
assert.equal((barPreview.match(/data-slot="icon"/g) ?? []).length, 3, "Every example destination renders its symbol");
assert.match(barPreview, /data-slot="badge"/, "Route badge is rendered");
assert.match(barPreview, /aria-current="page"/, "Current destination remains accessible");
const tabsPreview = previewOf("tab-view");
assert.match(tabsPreview, /role="tablist"/, "Local panels retain tablist semantics");
assert.equal((tabsPreview.match(/role="tab"/g) ?? []).length, 4, "Every local tab remains present");
assert.equal((tabsPreview.match(/aria-selected="true"/g) ?? []).length, 1, "One local tab is selected");
assert.match(read(output + "/ohmygui/index.html"), /Components for\s+real interfaces\./, "Hero line break is real text, not a literal escape");
const codePage = read(output + "/ohmygui/code-text/index.html");
const codePreview = codePage.match(/data-example="CodeText"[^>]*>([\s\S]*?)<\/astro-slot>/)?.[1] ?? "";
assert.match(codePreview, /data-mode="snippet"/, "CodeText snippet mode is prerendered");
assert.match(codePreview, /data-mode="full"/, "CodeText full mode is prerendered");
assert.equal((codePreview.match(/data-slot="copyButton"/g) ?? []).length, 1, "Legacy copyButton is retained in the snippet example");
assert.equal((codePreview.match(/data-slot="actions"/g) ?? []).length, 2, "Only explicitly supplied action sections render");
assert.match(codePreview, /Welcome\.tsx/, "Filename is prerendered");
assert.match(codePreview, /Wrap lines/, "Multiple caller-owned actions are prerendered");
for (const pre of codePreview.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g)) assert.doesNotMatch(pre[1], /<button\b/, "Copy controls must stay outside selectable pre/code content");
const colorPreview = read(output + "/ohmygui/color-picker/index.html").match(/data-example="ColorPicker"[^>]*>([\s\S]*?)<\/astro-slot>/)?.[1] ?? "";
assert.match(colorPreview, /data-ui="CodeText"[^>]*data-mode="snippet"/, "Legacy inline CodeText still renders as a snippet");
// Follow static chunk imports only; selected example modules remain dynamic imports.
const shell = readdirSync(output + "/_astro").find(name => /^Showcase\..*\.js$/.test(name));
assert(shell, "Showcase client bundle exists");
const visited = new Set();
function inspectChunk(file) {
  if (visited.has(file)) return;
  visited.add(file);
  assert(statSync(file).size < 1_000_000, "Shell eagerly loads a large chunk: " + file);
  for (const match of read(file).matchAll(/(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g)) inspectChunk(resolve(dirname(file), match[1]));
}
inspectChunk(resolve(output + "/_astro", shell));
console.log(`PASS shell loads ${visited.size} static chunks without eagerly loading the full icon registry.`);
console.log(`PASS ${catalog.length} components: complete inventory, unique routes, real SSR previews, exact executable source, landmarks, ids and local links.`);
