export const finiteNumber = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
export function rangeBounds(min = 0, max = 100, step = 1) {
  const lower = finiteNumber(min, 0), upper = Math.max(lower, finiteNumber(max, 100));
  return { min: lower, max: upper, step: step > 0 ? finiteNumber(step, 1) : 1 };
}
export function decimalPlaces(value: number) {
  const [mantissa, exponent = "0"] = String(value).toLowerCase().split("e");
  return Math.min(12, Math.max(0, (mantissa.split(".")[1]?.length ?? 0) - Number(exponent)));
}
export function snapNumber(value: number, min: number, max: number, step: number, base = min) {
  const safe = Math.min(max, Math.max(min, finiteNumber(value, Number.isFinite(min) ? min : 0)));
  const origin = Number.isFinite(base) ? base : 0;
  const snapped = Number((origin + Math.round((safe - origin) / step) * step).toFixed(Math.max(decimalPlaces(step), decimalPlaces(origin))));
  // The upper bound may not fall on the step grid; keep the last valid grid point.
  const last = Number.isFinite(max) ? origin + Math.floor((max - origin) / step + 1e-9) * step : max;
  return Math.min(max, Math.max(min, Number(Math.min(last, snapped).toFixed(Math.max(decimalPlaces(step), decimalPlaces(origin))))));
}
export const rangePercent = (value: number, min: number, max: number) => max === min ? 0 : Math.max(0, Math.min(100, (value - min) / (max - min) * 100));
