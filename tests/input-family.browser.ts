import { runInputFieldChecks } from "./input-fields.browser";
import { runNumericInputChecks } from "./input-numeric.browser";
import { runSelectionInputChecks } from "./input-selection.browser";
import { runPickerInputChecks } from "./input-pickers.browser";
import { runCalendarInputChecks } from "./input-calendar.browser";
import { runDatePickerChecks } from "./date-picker.browser";
import { runActionInputChecks } from "./input-actions.browser";
import { runSupportInputChecks } from "./input-support.browser";
import { runControlChecks, runButtonRippleChecks } from "./controls.browser";

/** Schedule then focus the page. Keep DevTools open for media emulation; run modes separately. */
export async function runInputFamilyChecks() {
  const results: { suite: string; groups: number; failures: unknown[] }[] = [];
  for (const [suite, run] of [
    ["fields", runInputFieldChecks], ["numeric", runNumericInputChecks], ["selection", runSelectionInputChecks],
    ["pickers", runPickerInputChecks], ["calendar", runCalendarInputChecks], ["date-picker", runDatePickerChecks], ["actions", runActionInputChecks], ["support", runSupportInputChecks],
  ] as const) {
    const result = await run(); results.push({ suite, groups: result.results.length, failures: result.failures }); result.dispose();
  }
  for (const [suite, run] of [["ripple-controls", runControlChecks], ["button-ripple", runButtonRippleChecks]] as const) {
    try { await run(); results.push({ suite, groups: 1, failures: [] }); }
    catch (error) { results.push({ suite, groups: 1, failures: [String(error)] }); }
  }
  const failures = results.filter(result => result.failures.length);
  const summary = { results, failures, groups: results.reduce((count, item) => count + item.groups, 0), reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, forced: matchMedia("(forced-colors: active)").matches };
  document.title = `Input family: ${summary.groups} groups, ${failures.length} failed suites`;
  console.log("INPUT-FAMILY", JSON.stringify(summary)); return summary;
}
