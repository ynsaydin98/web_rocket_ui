// Pure mapping from raw simulation state (missionControlStore) to
// ready-to-render view models, mirroring the design's renderVals(). Keeping
// this out of the components lets the schematic/graph/sequence panel stay
// presentational.

import { ptColor, tcColor } from "../engine/colorRamp";
import {
  SENSORS,
  STATUS_COLORS,
  STEPS,
  type SensorId,
} from "../config/missionControlConfig";
import type { IgniterState, MissionControlState, ValveState } from "../store/missionControlStore";

function fmt(id: SensorId, v: number): string {
  return id.startsWith("TC") ? String(Math.round(v)) : v.toFixed(1);
}

function fmtClock(t: number): string {
  const sign = t < 0 ? "T- " : "T+ ";
  const a = Math.abs(t);
  const m = Math.floor(a / 60);
  const s = a % 60;
  return `${sign}${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
}

function valveColor(s: ValveState): string {
  return s === "open" ? "#39e08a" : "#57697c";
}
function valveText(s: ValveState): string {
  return s === "open" ? "AÇIK" : "KAPALI";
}
function igniterColor(s: IgniterState): string {
  if (s === "fired") return "#ff4d4d";
  if (s === "armed") return "#ffb020";
  return "#57697c";
}
function igniterText(s: IgniterState): string {
  if (s === "fired") return "ATEŞLENDİ";
  if (s === "armed") return "KOLLANDI";
  return "GÜVENLİ";
}

function buildLinePoints(hist: number[], axisMax: number): string {
  const n = hist.length;
  if (n < 2) return "";
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 300;
    const y = 97 - Math.max(0, Math.min(1, hist[i] / axisMax)) * 92;
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

type BadgeDef = { id: SensorId; cx: number; cy: number; ax: number; ay: number };

const BADGE_DEFS: BadgeDef[] = [
  { id: "PT-01", cx: 80, cy: 88, ax: 95, ay: 170 },
  { id: "PT-02", cx: 195, cy: 88, ax: 178, ay: 170 },
  { id: "TC-01", cx: 140, cy: 378, ax: 140, ay: 290 },
  { id: "PT-03", cx: 608, cy: 95, ax: 608, ay: 196 },
  { id: "TC-02", cx: 608, cy: 375, ax: 608, ay: 264 },
  { id: "PT-04", cx: 770, cy: 95, ax: 720, ay: 170 },
  { id: "PT-05", cx: 770, cy: 375, ax: 720, ay: 290 },
];

export type SensorBadgeView = {
  id: string;
  cx: number;
  cy: number;
  ax: number;
  ay: number;
  foX: number;
  foY: number;
  color: string;
  reading: string;
};

export type GraphLineView = { color: string; label: string; points: string };

export type SequenceStepView = {
  n: number;
  label: string;
  state: "active" | "done" | "pending";
  tag: string;
  accentColor: string;
};

export type MissionControlView = {
  clockText: string;
  statusColor: string;
  status: MissionControlState["status"];
  valveMain: { color: string; text: string };
  valveManual: { color: string; text: string; sliderValue: 0 | 1 };
  igniter1: { color: string; text: string; state: IgniterState };
  igniter2: { color: string; text: string; state: IgniterState };
  badges: SensorBadgeView[];
  flowActive: boolean;
  exhaustActive: boolean;
  graphLines: GraphLineView[];
  steps: SequenceStepView[];
  canStart: boolean;
  showReset: boolean;
  abortUnlocked: boolean;
  unlockRemainingSec: number;
  lockIcon: string;
  abortSubLabel: string;
};

const GRAPH_SERIES: { id: SensorId; color: string; label: string; axisMax: number }[] = [
  { id: "PT-01", color: "#3aa0ff", label: "PT-1", axisMax: 60 },
  { id: "PT-03", color: "#ff4d4d", label: "PT-3", axisMax: 60 },
  { id: "PT-04", color: "#ff8a3a", label: "PT-4", axisMax: 60 },
  { id: "PT-05", color: "#38d6d6", label: "PT-5", axisMax: 60 },
  { id: "TC-02", color: "#ffb020", label: "TC-2", axisMax: 2600 },
];

export function buildMissionControlView(state: MissionControlState): MissionControlView {
  const statusColor = STATUS_COLORS[state.status];

  const badges: SensorBadgeView[] = BADGE_DEFS.map((d) => {
    const v = state.cur[d.id];
    const cfg = SENSORS[d.id];
    const color = d.id.startsWith("TC") ? tcColor(v, cfg.axis) : ptColor(v, cfg.axis);
    return {
      id: d.id.replace("-0", "-"),
      cx: d.cx,
      cy: d.cy,
      ax: d.ax,
      ay: d.ay,
      foX: d.cx - 32,
      foY: d.cy - 26,
      color,
      reading: `${fmt(d.id, v)} ${cfg.unit}`,
    };
  });

  const graphLines: GraphLineView[] = GRAPH_SERIES.map((s) => ({
    color: s.color,
    label: s.label,
    points: buildLinePoints(state.hist[s.id], s.axisMax),
  }));

  const steps: SequenceStepView[] = STEPS.map((step, i) => {
    const abortActive = state.aborted && i === 0;
    let stepState: SequenceStepView["state"];
    if (state.aborted) stepState = i === 0 ? "active" : "pending";
    else if (i < state.stepIndex) stepState = "done";
    else if (i === state.stepIndex && (state.running || i === 0)) stepState = "active";
    else stepState = "pending";

    const accentColor = abortActive ? "#ff4d4d" : statusColor;
    const tag = stepState === "active" ? (abortActive ? "ABORT" : "ACTIVE") : stepState === "done" ? "✓" : "";

    return { n: i, label: step.label, state: stepState, tag, accentColor };
  });

  const abortUnlocked = state.abortUnlockUntil > Date.now();
  const unlockRemainingSec = abortUnlocked ? Math.ceil((state.abortUnlockUntil - Date.now()) / 1000) : 0;

  const flowActive = state.valves.main === "open" && state.manualValve === "open" && !state.abortPhase;
  const exhaustActive = state.status === "FIRING" && state.valves.main === "open";

  return {
    clockText: fmtClock(state.clock),
    statusColor,
    status: state.status,
    valveMain: { color: valveColor(state.valves.main), text: valveText(state.valves.main) },
    valveManual: {
      color: valveColor(state.manualValve),
      text: valveText(state.manualValve),
      sliderValue: state.manualValve === "open" ? 1 : 0,
    },
    igniter1: { color: igniterColor(state.igniters.ig1), text: igniterText(state.igniters.ig1), state: state.igniters.ig1 },
    igniter2: { color: igniterColor(state.igniters.ig2), text: igniterText(state.igniters.ig2), state: state.igniters.ig2 },
    badges,
    flowActive,
    exhaustActive,
    graphLines,
    steps,
    canStart: !state.running && !state.aborted,
    showReset: state.aborted,
    abortUnlocked,
    unlockRemainingSec,
    lockIcon: abortUnlocked ? "\u{1F513}" : "\u{1F512}",
    abortSubLabel: abortUnlocked ? `AKTİF · ${unlockRemainingSec} sn` : "KİLİTLİ",
  };
}
