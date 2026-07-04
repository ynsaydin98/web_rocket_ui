// Multi-stop linear color ramps used to tint the schematic's circular
// pressure/temperature gauges by how close a reading is to its sensor axis.

type RampStop = [position: number, rgb: [number, number, number]];

function ramp(t: number, stops: RampStop[]): string {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (clamped <= p1) {
      const f = (clamped - p0) / (p1 - p0 || 1);
      const r = Math.round(c0[0] + (c1[0] - c0[0]) * f);
      const g = Math.round(c0[1] + (c1[1] - c0[1]) * f);
      const b = Math.round(c0[2] + (c1[2] - c0[2]) * f);
      return `rgb(${r},${g},${b})`;
    }
  }
  const [r, g, b] = stops[stops.length - 1][1];
  return `rgb(${r},${g},${b})`;
}

/** Pressure gauges: white at 0 bar, ramping to red as pressure rises. */
export function ptColor(value: number, axis: [number, number]): string {
  const t = (value - axis[0]) / (axis[1] - axis[0]);
  return ramp(t, [
    [0, [236, 242, 248]],
    [1, [255, 59, 48]],
  ]);
}

/** Temperature gauges: cold blue -> cyan -> white -> amber -> hot red. */
export function tcColor(value: number, axis: [number, number]): string {
  const t = (value - axis[0]) / (axis[1] - axis[0]);
  return ramp(t, [
    [0, [74, 148, 255]],
    [0.32, [57, 192, 214]],
    [0.52, [236, 242, 248]],
    [0.8, [255, 176, 32]],
    [1, [255, 59, 48]],
  ]);
}
