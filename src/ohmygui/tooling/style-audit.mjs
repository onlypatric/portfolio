#!/usr/bin/env node
/** Portable source audit. Parsers are development dependencies; runtime components never import this. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse as parseScript } from '@babel/parser';
import postcss from 'postcss';

const args = process.argv.slice(2);
const value = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined;
const configPath = path.resolve(value('--config') ?? 'ohmygui.styles.config.json');
const root = path.dirname(configPath), config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const library = path.resolve(root, config.libraryRoot);
const relative = file => path.relative(root, file).split(path.sep).join('/');
const baselinePath = path.resolve(root, config.baseline ?? 'ohmygui.styles.baseline.json');
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : { findings: [] };
const fingerprint = finding => crypto.createHash('sha256').update(JSON.stringify([finding.file, finding.kind, finding.selector, finding.property, finding.value])).digest('hex');
const previous = new Map(baseline.findings.map(item => [item.fingerprint, item.count ?? 1]));
const sharedMaximumCounts = new Map();
const allFindings = [], reports = [], visitedLibrary = new Set();
const sourceCache = new Map(), cssSources = new Map();
const isInside = (file, dir) => file === dir || file.startsWith(dir + path.sep);
const read = file => { if (!sourceCache.has(file)) sourceCache.set(file, fs.readFileSync(file, 'utf8')); return sourceCache.get(file); };
const namedColors = new Set('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'.split(' '));
const rawColor = text => /#[a-f\d]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklch|oklab|color)\(/i.test(String(text)) || namedColors.has(String(text).trim().toLowerCase());
function walk(node, visit, parent) {
  if (!node || typeof node !== 'object') return;
  if (typeof node.type === 'string') visit(node, parent);
  for (const [key, child] of Object.entries(node)) {
    if (['loc', 'start', 'end', 'extra', 'comments', 'tokens', 'errors'].includes(key)) continue;
    if (Array.isArray(child)) child.forEach(item => walk(item, visit, node)); else if (child && typeof child === 'object') walk(child, visit, node);
  }
}
function resolveImport(from, specifier) {
  const clean = specifier.split('?')[0];
  const target = clean.startsWith('@/') ? path.resolve(root, config.aliasRoot ?? 'src', clean.slice(2)) : clean.startsWith('.') ? path.resolve(path.dirname(from), clean) : null;
  if (!target) return null; // Package styles/implementations are outside consumer source ownership.
  for (const candidate of [target, ...['.tsx', '.ts', '.jsx', '.js', '.astro', '.css', '/index.tsx', '/index.ts', '/index.astro'].map(ext => target + ext)]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return { unresolved: specifier };
}
async function scriptAst(file) {
  const source = read(file);
  if (file.endsWith('.astro')) {
    const { parse } = await import('@astrojs/compiler-rs');
    return parse(source).ast;
  }
  return parseScript(source, { sourceType: 'unambiguous', plugins: ['typescript', 'jsx'], errorRecovery: false });
}
function lineOf(source, node) { return node.loc?.start.line ?? source.slice(0, node.start ?? 0).split('\n').length; }
function add(findings, file, kind, node, values = {}) {
  const item = { file: relative(file), line: node?.source?.start?.line ?? lineOf(fs.existsSync(file) ? read(file) : '', node ?? {}), kind, ...values };
  item.fingerprint = fingerprint(item); findings.push(item); return item;
}
function cssFindings(file, source, findings, dependencies, lineOffset = 0) {
  cssSources.set(file + ':' + lineOffset, { file, bytes: Buffer.byteLength(source) });
  const ast = postcss.parse(source, { from: file });
  ast.walkAtRules('import', rule => {
    let specifier = postcss.list.space(rule.params)[0];
    if (specifier?.startsWith('url(')) specifier = specifier.slice(4, -1).trim();
    specifier = specifier?.replace(/^['"]|['"]$/g, '');
    if (specifier && /^https?:/.test(specifier)) add(findings, file, 'uncertain-import', rule, { value: specifier });
    else if (specifier) dependencies.push(!specifier.startsWith('.') && fs.existsSync(path.resolve(path.dirname(file), specifier)) ? './' + specifier : specifier);
  });
  ast.walkDecls(decl => {
    let parent = decl.parent; while (parent && parent.type !== 'rule') parent = parent.parent;
    const selector = parent?.selector ?? '@root';
    const location = { source: { start: { line: decl.source.start.line + lineOffset } } };
    add(findings, file, 'css', location, { selector, property: decl.prop, value: decl.value });
    if (rawColor(decl.value)) add(findings, file, 'raw-color', location, { selector, property: decl.prop, value: decl.value });
    if (/\.ui-|\[data-(?:ui|slot|animated-selection)[\s=\]]/.test(selector)) add(findings, file, 'internal-override', location, { selector, property: decl.prop, value: decl.value });
  });
}
function inspectScript(file, ast, findings, dependencies) {
  const source = read(file), bindings = new Map();
  walk(ast, node => { if (node.type === 'VariableDeclarator' && node.id?.type === 'Identifier' && node.init) bindings.set(node.id.name, node.init); });
  const literal = node => node && ['StringLiteral', 'Literal'].includes(node.type) && typeof node.value === 'string' ? node.value : undefined;
  function style(node, stack = new Set()) {
    if (!node) return;
    if (node.type === 'Identifier' && bindings.has(node.name) && !stack.has(node.name)) return style(bindings.get(node.name), new Set([...stack, node.name]));
    if (['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression'].includes(node.type)) return style(node.expression, stack);
    if (node.type === 'ConditionalExpression') { style(node.consequent, stack); style(node.alternate, stack); return; }
    if (node.type !== 'ObjectExpression') { add(findings, file, 'uncertain-style', node, { value: source.slice(node.start, node.end) }); return; }
    for (const property of node.properties) {
      if (property.type === 'SpreadElement') { style(property.argument, stack); continue; }
      const key = property.key?.name ?? property.key?.value;
      if (!key || property.computed) { add(findings, file, 'uncertain-style', property, { value: source.slice(property.start, property.end) }); continue; }
      const text = source.slice(property.value.start, property.value.end);
      add(findings, file, 'inline', property, { property: key, value: text });
      if (rawColor(literal(property.value) ?? text)) add(findings, file, 'raw-color', property, { property: key, value: text });
    }
  }
  function classes(node, stack = new Set()) {
    const text = literal(node);
    if (text !== undefined) { for (const token of text.split(/\s+/).filter(Boolean)) add(findings, file, token.includes('[') ? 'arbitrary-utility' : 'class', node, { value: token }); return; }
    if (node?.type === 'Identifier' && bindings.has(node.name) && !stack.has(node.name)) return classes(bindings.get(node.name), new Set([...stack, node.name]));
    if (node?.type === 'ConditionalExpression') { classes(node.consequent, stack); classes(node.alternate, stack); return; }
    if (node?.type === 'TemplateLiteral') { node.quasis.forEach(quasi => classes({ type: 'StringLiteral', value: quasi.value.cooked, start: quasi.start, end: quasi.end })); node.expressions.forEach(expression => classes(expression, stack)); return; }
    add(findings, file, 'uncertain-class', node, { value: source.slice(node?.start ?? 0, node?.end ?? 0) });
  }
  walk(ast, node => {
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) {
      const target = literal(node.source); if (target && node.importKind !== 'type' && node.exportKind !== 'type') dependencies.push(target);
    }
    if (node.type === 'ImportExpression') {
      const target = literal(node.source); if (target) dependencies.push(target); else add(findings, file, 'uncertain-import', node, { value: source.slice(node.start, node.end) });
    }
    if (node.type === 'CallExpression' && node.callee?.type === 'Import') {
      const target = literal(node.arguments[0]); if (target) dependencies.push(target); else add(findings, file, 'uncertain-import', node, { value: source.slice(node.start, node.end) });
    }
    if (node.type === 'CallExpression' && node.callee?.type === 'MemberExpression' && node.callee.object?.type === 'MetaProperty' && node.callee.property?.name === 'glob') add(findings, file, 'uncertain-import', node, { value: source.slice(node.start, node.end) });
    if (node.type === 'JSXSpreadAttribute') {
      const seen = new Set();
      const inspectSpread = expression => {
        if (expression?.type === 'Identifier' && bindings.has(expression.name) && !seen.has(expression.name)) { seen.add(expression.name); return inspectSpread(bindings.get(expression.name)); }
        if (expression?.type !== 'ObjectExpression') { add(findings, file, 'uncertain-props', node, { value: source.slice(node.start, node.end) }); return; }
        for (const property of expression.properties) {
          if (property.type === 'SpreadElement') { inspectSpread(property.argument); continue; }
          const key = property.key?.name ?? property.key?.value;
          if (property.computed || !key) add(findings, file, 'uncertain-props', property, { value: source.slice(property.start, property.end) });
          else if (key === 'style') style(property.value);
          else if (['class', 'className'].includes(key)) classes(property.value);
          else if (key === 'classNames' || key === 'tokens') add(findings, file, 'uncertain-props', property, { value: source.slice(property.start, property.end) });
        }
      };
      inspectSpread(node.argument);
    }
    if (node.type === 'JSXAttribute') {
      const name = node.name?.name, expression = node.value?.type === 'JSXExpressionContainer' ? node.value.expression : node.value;
      if (name === 'style') style(expression);
      if (name === 'className' || name === 'class') classes(expression);
      if (name === 'classNames') {
        if (expression?.type === 'ObjectExpression') for (const prop of expression.properties) classes(prop.value);
        else add(findings, file, 'uncertain-class', node, { value: source.slice(node.start, node.end) });
      }
      if (['color', 'fill', 'stroke', 'background', 'backgroundColor'].includes(name) && rawColor(literal(expression))) add(findings, file, 'raw-color', node, { property: name, value: literal(expression) });
      if (name === 'tokens') add(findings, file, 'theme-override', node, { value: source.slice(node.start, node.end) });
    }
    if (node.type === 'JSXElement' && node.openingElement?.name?.name === 'style') {
      // Astro's compiler supplies the CSS text as a literal child; CSS itself is parsed by PostCSS.
      for (const child of node.children ?? []) {
        if (typeof child.value === 'string' && child.value.trim()) cssFindings(file, child.value, findings, dependencies, source.slice(0, child.start).split('\n').length - 1);
      }
    }
  });
}
function validExceptions() {
  for (const exception of config.exceptions ?? []) {
    if (!exception.source || !exception.selector || /[*]/.test(exception.source) || /(?:[*]|(?:^|[\s,>+~])(?:html|body|:root)(?:$|[\s,>+~.#[:]))/.test(exception.selector) || !exception.reason || !exception.owner || !exception.reviewWhen || !Array.isArray(exception.properties) || (!Number.isInteger(exception.maxDeclarations) || exception.maxDeclarations < 1)) throw new Error('Exceptions require an exact source/selector, bounded properties/count, reason, owner and review condition. Broad waivers are forbidden.');
  }
}
validExceptions();
// Check the runtime library boundary independently of consumer graph traversal.
const libraryViolations = [];
const libraryFiles = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? libraryFiles(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
for (const file of libraryFiles(library)) {
  if (/\.tsx?$/.test(file)) {
    walk(await scriptAst(file), node => {
      if ((['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration', 'ImportExpression'].includes(node.type) && node.source?.value && node.importKind !== 'type') || (node.type === 'CallExpression' && node.callee?.type === 'Import' && node.arguments[0]?.value)) {
        const specifier = node.source?.value ?? node.arguments[0].value;
        const target = resolveImport(file, specifier);
        if (specifier === 'recharts' || specifier.startsWith('recharts/') || (typeof target === 'string' && !isInside(target, library))) libraryViolations.push(relative(file) + ': runtime library import crosses into optional/application code: ' + specifier);
      }
    });
  } else if (file.endsWith('.css')) {
    postcss.parse(read(file), { from: file }).walkRules(rule => { if (rule.selector.includes('.team-')) libraryViolations.push(relative(file) + ': application selector copied into core: ' + rule.selector); });
  }
}
if (libraryViolations.length) { libraryViolations.forEach(message => console.error(message)); process.exitCode = 1; }
for (const consumer of config.consumers) {
  const findings = [], seen = new Set(), queue = consumer.entries.map(entry => path.resolve(root, entry));
  while (queue.length) {
    const file = queue.shift(); if (seen.has(file)) continue; seen.add(file);
    if (isInside(file, library)) { visitedLibrary.add(file); continue; }
    if (!isInside(file, root) || !fs.existsSync(file)) { add(findings, file, 'unresolved-import', {}, { value: file }); continue; }
    const dependencies = [];
    if (file.endsWith('.css')) cssFindings(file, read(file), findings, dependencies);
    else if (/\.(?:[cm]?[jt]sx?|astro)$/.test(file)) inspectScript(file, await scriptAst(file), findings, dependencies);
    for (const specifier of dependencies) {
      const target = resolveImport(file, specifier);
      if (target?.unresolved) add(findings, file, 'unresolved-import', {}, { value: target.unresolved }); else if (target) queue.push(target);
    }
  }
  const shared = findings.filter(item => (config.sharedLegacyFiles ?? []).includes(item.file));
  const local = findings.filter(item => !(config.sharedLegacyFiles ?? []).includes(item.file));
  const sharedCounts = new Map();
  for (const item of shared) sharedCounts.set(item.fingerprint, (sharedCounts.get(item.fingerprint) ?? 0) + 1);
  for (const [key, count] of sharedCounts) sharedMaximumCounts.set(key, Math.max(count, sharedMaximumCounts.get(key) ?? 0));
  const allowed = new Set();
  for (const exception of config.exceptions ?? []) {
    const matches = local.filter(item => item.file === exception.source && item.selector === exception.selector && exception.properties.includes(item.property));
    if (matches.filter(item => item.kind === 'css').length > exception.maxDeclarations) throw new Error('Exception exceeds its declaration budget: ' + exception.source + ' ' + exception.selector);
    matches.forEach(item => allowed.add(item.fingerprint));
    if (matches.some(item => item.kind === 'css')) for (const usage of exception.usages ?? []) {
      if (!usage.source || /[*]/.test(usage.source) || !usage.token || !exception.selector.includes('.' + usage.token)) throw new Error('Branding class usages require an exact file and a token present in the approved selector.');
      local.filter(item => item.file === usage.source && item.kind === 'class' && item.value === usage.token).forEach(item => allowed.add(item.fingerprint));
    }
  }
  const violations = local.filter(item => !allowed.has(item.fingerprint));
  const occurrences = new Map();
  const newShared = shared.filter(item => { const count = (occurrences.get(item.fingerprint) ?? 0) + 1; occurrences.set(item.fingerprint, count); return count > (previous.get(item.fingerprint) ?? 0); });
  const stats = Object.fromEntries(['css', 'inline', 'arbitrary-utility', 'class', 'raw-color', 'internal-override', 'uncertain-style', 'uncertain-class', 'uncertain-props', 'theme-override'].map(kind => [kind, local.filter(item => item.kind === kind).length]));
  const exceptionDeclarations = local.filter(item => item.kind === 'css' && allowed.has(item.fingerprint));
  const exceptionSelectors = new Set(exceptionDeclarations.map(item => item.file + ':' + item.selector));
  const cssBytes = [...cssSources.values()].filter(item => seen.has(item.file) && !(config.sharedLegacyFiles ?? []).includes(relative(item.file))).reduce((total, item) => total + item.bytes, 0);
  const budget = consumer.budget ?? { declarations: 20, selectors: 3, bytes: 2048 };
  const overBudget = exceptionDeclarations.length > budget.declarations || exceptionSelectors.size > budget.selectors || cssBytes > budget.bytes;
  reports.push({ consumer: consumer.name, files: [...seen].map(relative), stats, brandingDeclarations: exceptionDeclarations.length, brandingSelectors: exceptionSelectors.size, cssBytes, sharedLegacyFindings: shared.length, violations: [...violations, ...newShared], overBudget });
  allFindings.push(...findings);
}
if (args.includes('--write-baseline')) {
  const unique = new Map(allFindings.filter(item => (config.sharedLegacyFiles ?? []).includes(item.file)).map(item => [item.fingerprint, item]));
  for (const [key, item] of unique) if (sharedMaximumCounts.get(key) > 1) item.count = sharedMaximumCounts.get(key);
  const additions = [...unique.values()].filter(item => (item.count ?? 1) > (previous.get(item.fingerprint) ?? 0));
  if (baseline.findings.length && additions.length && !args.includes('--accept-reviewed-legacy')) throw new Error('Baseline update would add legacy debt. Review each addition, then explicitly acknowledge with --accept-reviewed-legacy.');
  fs.writeFileSync(baselinePath, JSON.stringify({ note: 'Reviewed shared legacy foundation debt only. New consumer styling cannot be waived by this baseline.', findings: [...unique.values()] }, null, 2) + '\n');
  console.log('Wrote shared foundation baseline:', relative(baselinePath));
} else {
  let failed = false;
  for (const report of reports) {
    console.log(`${report.violations.length || report.overBudget ? 'FAIL' : 'PASS'} ${report.consumer}: ${report.stats.css} CSS declarations, ${report.stats.inline} inline properties, ${report.stats['arbitrary-utility']} arbitrary utilities, ${report.stats['internal-override']} internal overrides; ${report.sharedLegacyFindings} separately recorded shared legacy findings`);
    for (const issue of report.violations) console.error(`  ${issue.file}:${issue.line} ${issue.kind}: ${issue.selector ?? ''} ${issue.property ?? ''} ${issue.value ?? ''}`);
    if (report.overBudget) console.error('  Branding exception budget exceeded.');
    failed ||= report.violations.length > 0 || report.overBudget;
  }
  if (value('--report')) fs.writeFileSync(path.resolve(root, value('--report')), JSON.stringify({ reports, note: 'Source-based audit; dynamic styles/imports are reported as uncertain, not silently accepted.' }, null, 2) + '\n');
  if (failed) process.exitCode = 1;
}
